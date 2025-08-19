import { useEffect, useState } from "react";
import { useSocket } from "../context/WebSocketContext";

export default function ServerLogToast() {
  const [visibleLog, setVisibleLog] = useState(null);
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsub = subscribe("logMessage", (data) => {
      const id = `${data.uuid}-${Date.now()}`;
      const newMsg = { id, ...data };

      setVisibleLog(newMsg);

      // Remove after 4 seconds
      setTimeout(() => {
        setVisibleLog(null);
      }, 4000);
    });

    return () => unsub();
  }, [subscribe]);

  return (
    <div className="h-15 relative overflow-hidden">
      {visibleLog && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-4 border-gray-300 bg-opacity-75  px-4 py-2 rounded shadow transition-opacity duration-500 animate-fade-in-out w-max max-w-xs">
          <p>{visibleLog.message}</p>
        </div>
      )}
    </div>
  );
}

//className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2"
