import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IUserMessage } from 'shared';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server;
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: IUserMessage,
    @ConnectedSocket()
    client: Socket,
  ): Promise<IUserMessage> {
    this.logger.log(payload);
    this.server.emit('chat', payload);
    return payload;
  }

  async sendMessage() {}
}
