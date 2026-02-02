//this is the first screen that the user sees, allowing them to connect to the backend server
import { useState } from "react";
import { useSocket } from "../context/WebSocketContext";
import { useEffect } from "react";

export default function Connect({ setUsername, setMenu }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { connect, subscribe } = useSocket();

  useEffect(() => {
    const unsubError = subscribe("error", (data) => {
      setError(data.message);
    });

    const unsubWelcome = subscribe("welcome", (data) => {
      setUsername(input);
      setMenu("roomOptions");
    });

    return () => {
      unsubError();
      unsubWelcome();
    };
  }, [input]);

  const handleConnect = () => {
    setError("");
    connect(input);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <input
        className="border border-gray-500 rounded-xl px-6 py-3 text-lg w-72"
        type="text"
        placeholder="enter your name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {error !== "" && <p className="text-red-500">{error}</p>}
      <button
        className="px-6 py-3 rounded-xl w-72"
        onClick={handleConnect}
        disabled={!input.trim()}>
        CONNECT
      </button>
      <h4>Having Trouble Connecting?</h4>
      <p className="px-5 max-w-md text-center">
        The server may be waking up (free hosting things :)) Please wait ~60
        seconds and try again!
      </p>
    </div>
  );
}
