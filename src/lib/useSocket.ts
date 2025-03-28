// useSocket.ts
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000"; // 서버 주소

export const useSocket = (
  userId: string,
  onNotification: (data: any) => void
) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("notification", onNotification);

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
