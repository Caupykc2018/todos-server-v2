import { Server } from 'socket.io';

const socketsById = { 0: [] };
const idBySocket = {};

export const createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    socket.on('SET_ID_SOCKET', ({ id }: { id: number }) => {
      if (idBySocket[socket.id] !== undefined) {
        socketsById[idBySocket[socket.id]] = socketsById[
          idBySocket[socket.id]
        ].filter((skt) => skt.id !== socket.id);
      }

      idBySocket[socket.id] = id;

      if (!socketsById[id]) {
        socketsById[id] = [];
      }

      socketsById[id] = [...socketsById[id], socket];
    });

    socket.on('disconnect', () => {
      if (idBySocket[socket.id] === undefined) return;
      socketsById[idBySocket[socket.id]] = socketsById[
        idBySocket[socket.id]
      ].filter((skt) => skt.id !== socket.id);
      idBySocket[socket.id] = undefined;
    });
  });

  return io;
};

export const getSocketsById = (id: number, filterSocketId?: string): any[] => {
  if (!socketsById[id]) {
    return [];
  }

  return filterSocketId
    ? socketsById[id].filter((skt) => skt.id !== filterSocketId)
    : socketsById[id];
};

export const getAllSockets = (filterSocketId?: string) => {
  let sockets = [];
  Object.keys(socketsById).forEach((key) => {
    sockets = sockets.concat(socketsById[key]);
  });

  if (filterSocketId) {
    sockets = sockets.filter((skt) => skt.id !== filterSocketId);
  }

  return sockets;
};
