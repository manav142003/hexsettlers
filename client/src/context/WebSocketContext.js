import { createContext, useContext } from "react";

export const WebSocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useSocket must be used within WebSocketProvider");
  return context;
};
