import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://mecanova.onrender.com';

let socket: Socket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let connectCallbacks: Array<() => void> = [];

export function onReconnect(cb: () => void) {
  connectCallbacks.push(cb);
  return () => {
    connectCallbacks = connectCallbacks.filter(c => c !== cb);
  };
}

export function connectSocket(token: string) {
  if (socket?.connected) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  });

  socket.on('connect', () => {
    connectCallbacks.forEach(cb => cb());
  });

  socket.on('disconnect', () => {
    reconnectTimer = setTimeout(() => {
      if (socket && !socket.connected) {
        socket.connect();
      }
    }, 3000);
  });

  socket.on('connect_error', () => {});

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  connectCallbacks = [];
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
