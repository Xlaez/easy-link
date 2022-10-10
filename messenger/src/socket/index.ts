import { Server } from 'socket.io';
import http from 'http';
import { logger } from '@/utils/logger';

class Socket {
  constructor() {}

  public users = (global.onlineMessagingUsers = new Map());

  /**@field origin would be updated to clients origin upon production  */
  public getIo = (server: http.Server) => {
    const io = new Server(server, {
      allowEIO3: true,
      httpCompression: true,
      transports: ['websocket', 'polling'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'PUREG'],
        // credentials: true,
      },
    });

    io.on('connected', (socket: any) => {
      logger.info(`${socket} connected`);
      socket.on('join-chat-room', ({ roomId, isChatRoom }) => {});
    });
    return io;
  };
}

export default Socket;
