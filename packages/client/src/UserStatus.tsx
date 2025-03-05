import React from 'react';
import { IUser } from 'shared';

interface UserStatusProps {
  isConnected: boolean;
  user: IUser;
}

const UserStatus: React.FC<UserStatusProps> = ({ isConnected, user }) => {
  return (
    <div className="flex flex-row items-center gap-2 font-semibold text-gray-800 justify-center">
      <span
        className={`inline-block w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        } animate-pulse`}
      ></span>
      <span>{user.userName}</span>
    </div>
  );
};

export default UserStatus;