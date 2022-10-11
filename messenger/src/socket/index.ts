import { Server } from 'socket.io';
import http from 'http';
import { logger } from '@/utils/logger';

class Socket {
  constructor() {}

  // would store list of online users provided by the go user service
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
      /**
       * @param data is optional. Should be used to send any extra data in the future
       */
      socket.on('new-message', ({ roomId, userId, data }) => {
        // emit message to client
        io.in(roomId).emit('new-message', {
          roomId,
          sender: userId,
          data,
        });
      });

      socket.on('typing', ({ roomId, userId }) => {
        // emit user that's typing
        io.in(roomId).emit('typing', {
          roomId,
          userId,
        });
      });

      socket.on('seen-message', ({ roomId, userId }) => {
        // emit user who's seen message
        io.in(roomId).emit('seen-message', {
          roomId,
          userId,
        });
      });

      socket.on('user-left', ({ roomId, isOrganization, userId, multi }) => {
        // emit user's departure
        io.in(roomId).emit('user-left', {
          roomId,
          userId,
          isOrganization,
          multi,
        });
      });

      socket.on('user-added', ({ roomId, isOrganization, userId, multi }) => {
        // emit user's arrival
        io.in(roomId).emit('user-added', {
          roomId,
          userId,
          isOrganization,
          multi,
        });
      });

      socket.on('user-removed', ({ roomId, isOrganization, userId, multi }) => {
        io.in(roomId).emit('user-removed', {
          roomId,
          userId,
          isOrganization,
          multi,
        });
      });

      socket.on('recording', ({ roomId, userId }) => {
        io.in(roomId).emit('recording', {
          roomId,
          userId,
        });
      });
    });
    return io;
  };
}

export default Socket;
