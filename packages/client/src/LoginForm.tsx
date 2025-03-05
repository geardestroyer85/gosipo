import React from 'react';
import { IUser } from 'shared';

interface LoginFormProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  handleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ user, setUser, handleLogin }) => {
  const handleLoginBtnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

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
};

export default LoginForm;