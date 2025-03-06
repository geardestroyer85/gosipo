  import React from 'react';
  import { IUser } from 'shared';
  import UserStatus from './UserStatus';

  interface HeaderProps {
    isConnected: boolean;
    user: IUser;
    handleLogout: () => void;
  }

  const Header: React.FC<HeaderProps> = ({ isConnected, user, handleLogout }) => {
    return (
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <UserStatus isConnected={isConnected} user={user} />
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-all duration-200 font-medium text-sm hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </header>
    );
  };

  export default Header;
