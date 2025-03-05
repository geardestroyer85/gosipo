import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { IUser, IUserMessage } from 'shared';


function App() {
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<IUserMessage[]>([]);
  const [user, setUser] = useState<IUser>({
    userId: Math.random().toString(36).substring(7),
    userName: '',
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
    const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    if (currentUser.userId && currentUser.userName) {
      setCanChat(true);
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (canChat && !socket) {
      const newSocket = io();
      setSocket(newSocket);
    }
  }, [canChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onEvents = (msg: IUserMessage) => {
      setHistory((prev) => [...prev, msg]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('events', onEvents);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('events', onEvents);
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleLogin = () => {
    if (!user.userName.trim()) return;

    const newSocket = io();
    setSocket(newSocket);
    sessionStorage.setItem('user', JSON.stringify(user));
    setCanChat(true);

    newSocket.on('connect', () => {
      const greetings: IUserMessage = {
        user: {
          userId: 'greetings',
          userName: 'Notification',
        },
        message: `${user.userName} joined the chat`,
        timestamp: Date.now(),
      };
      newSocket.emit('events', greetings);
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canChat || !socket) return;

    const newMessage: IUserMessage = {
      user,
      message,
      timestamp: Date.now(),
    };

    try {
      socket.emit('events', newMessage);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLoginBtnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogout = () => {
    if (!socket) return;

    const logoutMessage: IUserMessage = {
      user: {
        userId: 'greetings',
        userName: 'Notification',
      },
      message: `${user.userName} left the chat`,
      timestamp: Date.now(),
    };

    try {
      socket.emit('events', logoutMessage);
      socket.disconnect();
      setSocket(undefined);
      setHistory([]);
      setUser({ userId: Math.random().toString(36).substring(7), userName: '' });
      sessionStorage.removeItem('user');
      setCanChat(false);
      setMessage('');
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!canChat) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Join the Chat</h2>
          <form onSubmit={handleLoginBtnSubmit} className="space-y-6">
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
                onChange={(e) => setUser((prev) => ({ ...prev, userName: e.target.value }))}
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
                  <span className="font-semibold text-sm">{msg.user.userName}</span>
                  <span className="text-xs opacity-75">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="border-t bg-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={sendMessage} className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-2 font-semibold text-gray-800 justify-center">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}
              ></span>
              <span>{user.userName}</span>
            </div>
            <div className="relative flex-grow">
              <textarea
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm shadow-sm transition-all duration-200"
                placeholder="Type your message... (Shift + Enter for new line)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                style={{ minHeight: '50px' }}
              />
            </div>
            <div className="flex flex-col justify-around">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-all duration-200 font-medium disabled:opacity-50 text-sm hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                disabled={!message.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-all duration-200 font-medium text-sm hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;