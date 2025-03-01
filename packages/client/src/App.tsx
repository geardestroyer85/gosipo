import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

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
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<IUserMessage[]>([]);
  const [user, setUser] = useState<IUser>({
    userId: Math.random().toString(36).substring(7),
    userName: ''
  });
  const [canChat, setCanChat] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('events', (msg: IUserMessage) => {
      setHistory(prev => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleGreeting = () => {
    if (!user.userName.trim()) return;

    const newSocket = io();
    setSocket(newSocket);

    const greetings: IUserMessage = {
      user: {
        userId: 'greetings',
        userName: 'Notification'
      },
      message: `${user.userName} joined the chat`,
      timestamp: Date.now()
    }

    newSocket.emit('events', greetings)

    setTimeout(() => setCanChat(true), 200)
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canChat || !socket) return;

    const newMessage: IUserMessage = {
      user,
      message,
      timestamp: Date.now()
    };

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

  const handleLogout = () => {
    if (!socket) return;

    const logoutMessage: IUserMessage = {
      user: {
        userId: 'greetings',
        userName: 'Notification'
      },
      message: `${user.userName} left the chat`,
      timestamp: Date.now()
    }
    socket.emit('events', logoutMessage);
    socket.disconnect();
    setSocket(undefined);
    setHistory([]);
    setUser({ userId: Math.random().toString(36).substring(7), userName: '' });
    setCanChat(false);
    setMessage('');
  };

  if (!canChat) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Join the Chat</h2>
          <form onSubmit={handleGreetingSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={user.userName}
                onChange={(e) => setUser(prev => ({ ...prev, userName: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50"
              disabled={!user.userName.trim()}
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="min-h-full flex flex-col justify-end">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                windowWidth <= 768 && msg.user.userId === user.userId
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-md p-4 rounded-lg ${
                  msg.user.userName === 'Notification' 
                    ? 'bg-yellow-500 text-white'
                    : msg.user.userId === user.userId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-white'
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
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-32"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-500 mr-2">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors font-medium disabled:opacity-50 shadow-lg hover:shadow-xl"
              disabled={!message.trim()}
            >
              Send
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;