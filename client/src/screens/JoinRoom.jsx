//this screen allows the user to either create a room or join an existing room
import { useEffect, useState } from "react";
import { useSocket } from "../context/WebSocketContext";
import RoomPinModal from "../components/RoomPinModal";

export default function JoinRoom({ username, setMenu, setRoomPIN, setPlayers, setHost }) {
  const [input, setInput] = useState("");
  const { send, subscribe } = useSocket();
  const [error, setError] = useState("");
  const [showRoomCodeInput, setShowRoomCodeInput] = useState(false);

  useEffect(() => {
    //handle the result of joining/creating a room (both send the same JSON)
    const handleRoomResult = (data) => {
      if (data.success) {
        setRoomPIN(data.pin);
        setPlayers(data.players);
        setHost(data.host);
        setMenu("lobby");
      } else {
        setError(data.error);
      }
    };

    const unsubJoin = subscribe("joinRoomResult", handleRoomResult);
    const unsubCreate = subscribe("createRoomResult", handleRoomResult);

    return () => {
      unsubJoin();
      unsubCreate();
    };
  }, []);

  const createRoom = () => {
    send({ type: "createRoom" });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Welcome, {username}!</h2>
      <button onClick={() => setShowRoomCodeInput(true)}>Join Room</button>
      <button onClick={() => createRoom()}>Create Room</button>
      {showRoomCodeInput && <RoomPinModal onComplete={() => setShowRoomCodeInput(false)} error={error} />}
    </div>
  );
}
