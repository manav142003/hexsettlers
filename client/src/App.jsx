import { useState } from "react";
import JoinRoom from "./screens/JoinRoom";
import Lobby from "./screens/Lobby";
import GameScreen from "./screens/GameScreen";
import "./components/Modal.css";
import DisclaimerModal from "./components/DisclaimerModal";
import Connect from "./screens/Connect";
import { useSocket } from "./context/WebSocketContext";
function App() {
  const [screen, setScreen] = useState("home");
  const [username, setUsername] = useState("");
  const [roomPIN, setRoomPIN] = useState(null);
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState(null);
  const [menu, setMenu] = useState("connect");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div>
      {screen === "home" && (
        <div className="min-h-screen grid grid-rows-[auto,auto,auto] justify-center px-5 sm:px-10 md:px-20">
          {/* header: logo */}
          <header className="row-start-1 content-center">
            <img src="/images/logo.png" alt="Logo" />
          </header>

          {/* main content: enter username, join/create room, lobby */}
          <main className="row-start-2 flex justify-center">
            {menu === "connect" && <Connect setUsername={setUsername} setMenu={setMenu} />}
            {menu === "roomOptions" && <JoinRoom username={username} setMenu={setMenu} setRoomPIN={setRoomPIN} setPlayers={setPlayers} setHost={setHost} />}
            {menu === "lobby" && <Lobby roomPIN={roomPIN} players={players} setPlayers={setPlayers} setScreen={setScreen} host={host} />}
          </main>

          {/* footer: disclaimer */}
          <footer className="row-start-3 grid justify-center content-center py-4">
            <button onClick={() => setShowDisclaimer(true)}>Disclaimer</button>
          </footer>

          {/* modals */}
          {showDisclaimer && <DisclaimerModal onComplete={() => setShowDisclaimer(false)} />}
        </div>
      )}

      {screen === "game" && <GameScreen players={players} />}
    </div>
    // <>
    //   {screen === "home" && <Home username={username} setUsername={setUsername} setScreen={setScreen} roomPIN={roomPIN} setRoomPIN={setRoomPIN} setPlayers={setPlayers} setHost={setHost} />}
    //   {screen === "join" && <JoinRoom username={username} setRoomPIN={setRoomPIN} setPlayers={setPlayers} setScreen={setScreen} setHost={setHost} />}
    //   {screen === "lobby" && <Lobby roomPIN={roomPIN} players={players} setPlayers={setPlayers} setScreen={setScreen} host={host} />}
    //   {screen === "game" && <GameScreen players={players} />}
    // </>
  );
}

export default App;
