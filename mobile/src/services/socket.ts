import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.100.104:4000';

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
