export interface IUser {
  userId: string;
  userName: string;
}

export interface IUserMessage {
  user: IUser;
  message: string;
  timestamp: number;
}

export interface IServer2Client {
  chat: (e: IUserMessage) => void
}

export interface IClient2Server {
  chat: (e: IUserMessage) => void
}