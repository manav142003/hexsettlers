import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/WebSocketContext";
import ActionMenuButton from "./ActionMenuButton";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { playerColourMap } from "../context/PlayerColourContext";

export default function ServerLog({ enabled, onBack }) {
  const { subscribe } = useSocket();
  const [log, setLog] = useState([]); //keeps track of messages from server
  const colourMap = playerColourMap();

  useEffect(() => {
    const unsubLog = subscribe("logMessage", (data) => {
      setLog((prev) => [{ message: data.message, uuid: data.uuid }, ...prev]);
    });

    return () => unsubLog();
  }, [subscribe]);

  if (!enabled) return null;

  return (
    <div className="mx-10">
      <h4 className="font-bold text-2xl my-2">Server Log</h4>
      <div className="flex flex-col-reverse max-h-30 xl:max-h-110 2xl:max-h-140 overflow-y-auto my-5">
        {log.length > 0 ? (
          log.map((entry, i) => {
            const { message, uuid } = entry;
            const playerColour = colourMap[uuid] || "black";

            // Extract the player's name (assumed to be the first word in the message)
            const firstWord = message.split(" ")[0];
            const parts = message.split(firstWord);

            return (
              <div key={i}>
                {parts[0]}
                <span style={{ color: playerColour, fontWeight: "bold" }}>{firstWord}</span>
                {parts[1]}
              </div>
            );
          })
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <ActionMenuButton onClick={onBack} icon={faLeftLong} />
    </div>
  );
}
