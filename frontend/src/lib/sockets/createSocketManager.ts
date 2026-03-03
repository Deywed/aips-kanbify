import {
  io,
  type ManagerOptions,
  type Socket,
  type SocketOptions,
} from 'socket.io-client';

type SocketManagerOptions = {
  baseUrl: string;
  namespace: string;
  options?: Partial<ManagerOptions & SocketOptions>;
};

type SocketConnectOverrides = {
  namespace?: string;
  auth?: Record<string, unknown>;
  query?: Record<string, string | number | boolean>;
  options?: Partial<ManagerOptions & SocketOptions>;
};

type SocketManager = {
  connect: (overrides?: SocketConnectOverrides) => Socket;
  disconnect: () => void;
  getSocket: () => Socket | null;
  emit: <T>(event: string, payload: T) => void;
};

export const createSocketManager = ({
  baseUrl,
  namespace,
  options,
}: SocketManagerOptions): SocketManager => {
  let socket: Socket | null = null;
  let activeNamespace = namespace;

  const connect = (overrides?: SocketConnectOverrides) => {
    const resolvedNamespace = overrides?.namespace ?? namespace;

    if (socket?.connected && activeNamespace === resolvedNamespace) {
      return socket;
    }

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    const mergedOptions = {
      ...options,
      ...overrides?.options,
    } as Partial<ManagerOptions & SocketOptions>;

    activeNamespace = resolvedNamespace;

    socket = io(`${baseUrl}${resolvedNamespace}`, {
      ...mergedOptions,
      ...(overrides?.auth ? { auth: overrides.auth } : {}),
      ...(overrides?.query ? { query: overrides.query } : {}),
    });

    return socket;
  };

  const disconnect = () => {
    if (!socket) return;
    socket.disconnect();
    socket = null;
  };

  const emit = <T>(event: string, payload: T) => {
    if (!socket) return;
    socket.emit(event, payload);
  };

  const getSocket = () => socket;

  return { connect, disconnect, getSocket, emit };
};
