export interface IUser {
  userId: string;
  userName: string;
}

export interface IUserMessage {
  user: IUser;
  message: string;
  timestamp: number;
}