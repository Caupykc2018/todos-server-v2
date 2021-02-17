import { getAllSockets, getSocketsById } from './index';

export const emitSocketsById = (
  type: string,
  payload: any,
  id?: number,
  filterSocketId?: string
) => {
  getSocketsById(id, filterSocketId).forEach((socket) =>
    socket.emit(type, payload));
};

export const emitAll = (
  type: string,
  payload: any,
  filterSocketId?: string
) => {
  getAllSockets(filterSocketId).forEach((socket) => socket.emit(type, payload));
};
