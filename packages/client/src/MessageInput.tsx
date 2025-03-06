import React, { useEffect, useRef } from 'react';
import { IUser } from 'shared';

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isConnected: boolean;
  user: IUser;
  handleLogout: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendMessage,
  handleKeyDown,
  handleLogout,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={sendMessage} className="flex flex-row flex-grow gap-4">
      <div className="relative flex-grow flex items-center justify-center">
        <textarea
          ref={textareaRef}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all duration-200 whitespace-pre-wrap overflow-y-auto"
          placeholder="Type your message... (Shift + Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ 
            minHeight: '38px',
            maxHeight: `${38 * 10}px`,
            overflowY: message.split('\n').length > 10 ? 'scroll' : 'hidden'
          }}
        />
      </div>
      <div className="flex flex-col justify-around gap-1">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-all duration-200 font-medium text-sm hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;