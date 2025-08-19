import { useState, useEffect } from "react";
import { useSocket } from "../context/WebSocketContext";
import RoomPinModal from "../components/RoomPinModal";
import DisclaimerModal from "../components/DisclaimerModal";
import Lobby from "./Lobby";

export default function Home({ username, setUsername, setScreen, setRoomPIN, roomPIN, players, setPlayers, host, setHost }) {
  const [nameInput, setNameInput] = useState("");
  const [menu, setMenu] = useState("connect");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showRoomCodeInput, setShowRoomCodeInput] = useState(false);
  const { connect, isConnected, send, subscribe, id } = useSocket();

  useEffect(() => {
    //handle the result of joining/creating a room (both send the same JSON)
    const handleRoomResult = (data) => {
      if (data.success) {
        setRoomPIN(data.pin);
        setPlayers(data.players);
        setHost(data.host);
        setMenu("lobby");
        //setScreen("lobby");
      } else alert(data.error);
    };

    const unsubJoin = subscribe("joinRoomResult", handleRoomResult);
    const unsubCreate = subscribe("createRoomResult", handleRoomResult);

    return () => {
      unsubJoin();
      unsubCreate();
    };
  }, []);

  const handleConnect = () => {
    //upon connection, we set the user's username, connect them to the backend server, and move them to the 'join' screen
    setUsername(nameInput);
    connect(nameInput);
  };

  const createRoom = () => {
    send({ type: "createRoom" });
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto,auto,auto] justify-center px-5 sm:px-10 md:px-20">
      {/* header: logo */}
      <header className="row-start-1 content-center">
        <img src="/images/logo.png" alt="Logo" />
      </header>

      {/* main content: enter username, join/create room, lobby */}
      <main className="row-start-2 flex items-center justify-center">
        <div className="w-full max-w-[1000px]">
          {menu === "connect" && isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <h2>Welcome, {username}!</h2>
              <button onClick={() => setShowRoomCodeInput(true)}>Join Room</button>
              <button onClick={() => createRoom()}>Create Room</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-6">
              <input className="border border-gray-500 rounded-xl px-6 py-3 text-lg w-72" type="text" placeholder="enter your name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
              <button className="px-6 py-3 rounded-xl w-72" onClick={handleConnect} disabled={!nameInput.trim()}>
                CONNECT
              </button>
            </div>
          )}

          {menu === "lobby" && <Lobby roomPIN={roomPIN} players={players} setPlayers={setPlayers} setScreen={setScreen} host={host} />}
        </div>
      </main>

      {/* footer: disclaimer */}
      <footer className="row-start-3 content-center py-4">
        <button onClick={() => setShowDisclaimer(true)}>Disclaimer</button>
      </footer>

      {/* modals */}
      {showDisclaimer && <DisclaimerModal onComplete={() => setShowDisclaimer(false)} />}
      {showRoomCodeInput && <RoomPinModal onComplete={() => setShowRoomCodeInput(false)} />}
    </div>
  );
}
