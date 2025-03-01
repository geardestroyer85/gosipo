import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io();

interface IUser {
  userId: string;
  userName: string;
}

interface IUserMessage {
  user: IUser;
  message: string;
}

function App() {
  const [greetings, setGreetings] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [message, setMessage] = useState<string>('');
  const [history, setHistory] = useState<IUserMessage[]>([]);
  const [user, setUser] = useState<IUser>({
    userId: Math.random().toString(36).substring(7),
    userName: ''
  });

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('events', (e: IUserMessage) => {
      setHistory((prevHistory) => [...prevHistory, e]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  const getGreetings = (): void => {
    setGreetings('');

    fetch('/api/hello')
      .then((response) => response.json())
      .then((data: { message: string }) => {
        setGreetings(data.message);
        setHistory(prev => [...prev, {
          user: { userId: 'server', userName: 'Server' },
          message: data.message
        }]);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  const sendMessage = (): void => {
    socket.emit('events', {
      user,
      message
    });
    setMessage('');
  }

  const setMessageStyle = (messageUserId: string): string => {
    return messageUserId === user.userId
      ? 'bg-purple-600 p-4 ml-24 mb-4 rounded-lg shadow-md'
      : 'bg-gray-600 p-4 mr-24 mb-4 rounded-lg shadow-md';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <span className="font-medium">Client:</span>
        <span className="flex items-center gap-2">
          My name is {
            greetings ? 
            <span className="font-semibold">{user.userName}</span> :
            <input 
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={user.userName}
              onChange={(e) => setUser((user) => ({...user, userName: e.target.value}))}
            />
          }
          <button 
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            onClick={getGreetings}
          >
            Hi, server
          </button>
        </span>
      </div>
      {isConnected && (
        <form 
          className="sticky top-0 bg-white p-4 border-b mb-6 flex items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <span className="flex items-center gap-2">
            <span className="font-medium">Client:</span>
            <input
              className="border border-gray-300 rounded-md px-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
          </span>
          <button 
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            type="submit"
          >
            Send Message
          </button>
        </form>
      )}
      <div className="space-y-4">
        {history.map((message, index) => (
          <div
            key={index}
            className={setMessageStyle(message.user.userId)}
          >
            <div className="flex gap-3">
              <span className="text-gray-300 font-medium">
                {message.user.userName}:
              </span>
              <span className="text-white">{message.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;