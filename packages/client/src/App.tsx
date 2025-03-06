import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IUser, IUserMessage, IServer2Client, IClient2Server } from 'shared';
import LoginForm from './LoginForm';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import Header from './Header';

function App() {
  const [socket, setSocket] = useState<Socket<IServer2Client, IClient2Server> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<IUserMessage[]>([]);
  const [user, setUser] = useState<IUser>({
    userId: Math.random().toString(36).substring(7),
    userName: '',
  });
  const [canChat, setCanChat] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    if (!canChat) return;

    const newSocket = io();
    setSocket(newSocket);

    const onConnect = () => {
      setIsConnected(true);
      const greetings: IUserMessage = {
        user: { userId: 'greetings', userName: 'Notification' },
        message: `${user.userName} joined the chat`,
        timestamp: Date.now(),
      };
      newSocket.emit('chat', greetings);
    };

    const onDisconnect = () => setIsConnected(false);
    const onChat = (msg: IUserMessage) => {
      setHistory((prev) => [...prev, msg]);
    };

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('chat', onChat);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('chat', onChat);
      newSocket.disconnect();
    };
  }, [canChat, user.userName]);

  const handleLogin = () => {
    if (!user.userName.trim()) return;
    sessionStorage.setItem('user', JSON.stringify(user));
    setCanChat(true);
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
      socket.emit('chat', newMessage);
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

  const handleLogout = () => {
    if (!socket) return;

    const logoutMessage: IUserMessage = {
      user: { userId: 'greetings', userName: 'Notification' },
      message: `${user.userName} left the chat`,
      timestamp: Date.now(),
    };

    try {
      socket.emit('chat', logoutMessage);
      socket.disconnect();
      setSocket(null);
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
    return <LoginForm user={user} setUser={setUser} handleLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header isConnected={isConnected} user={user} handleLogout={handleLogout} />
      <ChatWindow history={history} user={user} windowWidth={windowWidth} />
      <div className="border-t bg-white px-2 py-2 shadow-lg">
        <div className="flex gap-4 justify-between max-w-6xl mx-auto">
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleKeyDown={handleKeyDown}
            isConnected={isConnected}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}

export default App;