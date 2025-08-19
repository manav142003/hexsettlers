import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/WebSocketContext";

export default function ServerLogToast() {
  const [visibleLog, setVisibleLog] = useState(null);
  const { subscribe } = useSocket();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const unsubPromptMessage = subscribe("promptMessage", (data) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisibleLog(data.message);
    });

    const unsubLogMessage = subscribe("logMessage", (data) => {
      setVisibleLog(data.message);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setVisibleLog(null);
        timeoutRef.current = null;
      }, 5000);
    });

    return () => {
      unsubLogMessage();
      unsubPromptMessage();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [subscribe]);

  return (
    <div className="h-15 relative overflow-hidden">
      {visibleLog && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border-4 border-gray-300 bg-opacity-75  px-4 py-2 rounded-xl shadow transition-opacity duration-500 animate-fade-in-out w-max max-w-md">
          <p>{visibleLog}</p>
        </div>
      )}
    </div>
  );
}
