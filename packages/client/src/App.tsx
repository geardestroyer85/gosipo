import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io();

interface IUser {
  userId: string;
  userName: string;
}

interface IUserMessage {
  user: IUser;
  message: string;
  timestamp: number;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<IUserMessage[]>([]);
  const [user, setUser] = useState<IUser>({
    userId: Math.random().toString(36).substring(7),
    userName: ''
  });
  const [canChat, setCanChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('events', (msg: IUserMessage) => {
      console.log("event socket arrived")
      setHistory(prev => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleGreeting = () => {
    if (!user.userName.trim()) return;

    // Add user's greeting to history
    const userGreeting: IUserMessage = {
      user,
      message: `${user.userName} joined the chat`,
      timestamp: Date.now()
    };
    
    setHistory(prev => [...prev, userGreeting]);
    
    // Simulate server response with delay
    setTimeout(() => {
      const serverResponse: IUserMessage = {
        user: { userId: 'server', userName: 'Server' },
        message: `Welcome ${user.userName}! You can chat now.`,
        timestamp: Date.now()
      };
      
      setHistory(prev => [...prev, serverResponse]);
      setCanChat(true);
    }, 1500);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canChat) return;

    const newMessage: IUserMessage = {
      user,
      message,
      timestamp: Date.now()
    };

    console.log(newMessage)

    socket.emit('events', newMessage);
    setMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGreetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGreeting();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="min-h-full flex flex-col justify-end">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.user.userId === user.userId ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-md p-4 rounded-lg ${
                  msg.user.userId === 'server' 
                    ? 'bg-yellow-600 text-white'
                    : msg.user.userId === user.userId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {msg.user.userName}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4 shadow-lg">
        {!canChat ? (
          <form onSubmit={handleGreetingSubmit} className="max-w-2xl mx-auto flex gap-4 items-center">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              value={user.userName}
              onChange={(e) => setUser(prev => ({ ...prev, userName: e.target.value }))}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
              disabled={!user.userName.trim()}
            >
              Hi Server
            </button>
          </form>
        ) : (
          <form onSubmit={sendMessage} className="max-w-2xl mx-auto flex gap-4">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
              disabled={!message.trim()}
            >
              Send
            </button>
          </form>
        )}
        
        <div className="text-center mt-2 text-sm text-gray-500">
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </div>
    </div>
  );
}

export default App;