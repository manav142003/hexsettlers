//this is the first screen that the user sees, allowing them to connect to the backend server
import { useState } from "react";
import { useSocket } from "../context/WebSocketContext";

export default function Connect({ setUsername, setMenu }) {
  const [input, setInput] = useState("");
  const { connect } = useSocket();

  const handleConnect = () => {
    //upon connection, we set the user's username, connect them to the backend server, and move them to the 'join' screen
    setUsername(input);
    connect(input);
    setMenu("roomOptions");
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <input className="border border-gray-500 rounded-xl px-6 py-3 text-lg w-72" type="text" placeholder="enter your name" value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="px-6 py-3 rounded-xl w-72" onClick={handleConnect} disabled={!input.trim()}>
        CONNECT
      </button>
    </div>
  );
}
