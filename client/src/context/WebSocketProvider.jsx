import { WebSocketContext } from "./WebSocketContext";
import useWebSocket from "../hooks/useWebSocket";

function WebSocketProvider({ children }) {
  const socket = useWebSocket("ws://localhost:8000");

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
}

export default WebSocketProvider;
