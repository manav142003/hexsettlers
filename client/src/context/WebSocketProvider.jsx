import { WebSocketContext } from "./WebSocketContext";
import useWebSocket from "../hooks/useWebSocket";

function WebSocketProvider({ children }) {
  const socket = useWebSocket("wss://hex-settlers-server.onrender.com");

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
}

export default WebSocketProvider;
