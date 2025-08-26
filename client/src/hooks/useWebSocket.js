import { useRef, useState, useCallback } from "react";

export default function useWebSocket() {
  const socketRef = useRef(null);
  const listenersRef = useRef({});
  const [id, setId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((username) => {
    if (socketRef.current && socketRef.current.readyState <= 1) return;
    const ws = new WebSocket(`wss://hex-settlers-server.onrender.com?username=${username}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.warn("Non-JSON message:", event.data);
        return;
      }

      if (data.type === "welcome" && data.uuid) setId(data.uuid);

      const subs = listenersRef.current?.[data.type] || [];
      subs.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error("Listener error", e);
        }
      });
    };

    ws.onclose = () => {
      console.log(`${username} disconnected - WebSocket closed.`);
    };
  }, []);

  const send = useCallback((msg) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not connected");
    }
  }, []);

  const subscribe = useCallback((type, callback) => {
    //first we initialize listenersRef.current if it hasn't been yet
    if (!listenersRef.current) {
      listenersRef.current = {};
    }

    //if there's not yet a listener array for this type of message, create one
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = [];
    }

    //add the callback function to the list of subscribers for this message type
    listenersRef.current[type].push(callback);

    return () => {
      listenersRef.current[type] = listenersRef.current[type].filter((cb) => cb !== callback);
    };
  }, []);

  return { connect, isConnected, send, subscribe, id };
}
