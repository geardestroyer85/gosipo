import React, { useEffect, useRef } from 'react';
import { IUser } from 'shared';

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isConnected: boolean;
  user: IUser;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendMessage,
  handleKeyDown
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={sendMessage} className="flex flex-row flex-grow gap-2">
      <div className="relative flex-grow flex items-center justify-center">
        <textarea
          ref={textareaRef}
          className="w-full bg-gray-50 rounded-lg px-3 py-1 outline-none text-sm transition-all duration-200 whitespace-pre-wrap overflow-y-auto resize-none"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ 
            minHeight: '30px',
            maxHeight: `${30 * 10}px`,
            overflowY: message.split('\n').length > 10 ? 'scroll' : 'hidden'
          }}
        />
      </div>
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          disabled={!message.trim()}
          className={`${message.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'} bg-white px-3 py-1 rounded-full transition-all duration-200 font-medium text-sm transform flex items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;