import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export const useSocketSubscription = (
  socket: Socket | null,
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (payload: any) => void,
) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};
