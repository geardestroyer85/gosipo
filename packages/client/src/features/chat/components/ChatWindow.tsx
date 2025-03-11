import React, { useEffect, useRef } from 'react';
import { IUser, IUserMessage } from 'shared';

interface ChatWindowProps {
  history: IUserMessage[];
  user: IUser;
  windowWidth: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ history, user, windowWidth }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="min-h-full flex flex-col justify-end">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              windowWidth <= 768 && msg.user.userId === user.userId
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md px-3 py-2 rounded-lg ${
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
  );
};

export default ChatWindow;