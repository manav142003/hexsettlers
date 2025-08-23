//this screen is the room lobby where players wait to all ready up and begin the game.
import { useEffect, useState } from "react";
import { useSocket } from "../context/WebSocketContext";

export default function Lobby({ roomPIN, setScreen, setMenu }) {
  const { send, subscribe, id } = useSocket();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState(null);

  useEffect(() => send({ type: "updatePlayerList", pin: roomPIN }), []); //request the game state from the server

  useEffect(() => {
    //we must listen to playerListUpdates and initializeGame messages from the server.
    const unsubPlayerListUpdate = subscribe("playerListUpdate", (data) => {
      setPlayers(data.players);
      const hostPlayer = data.players.find((player) => player.isHost);
      if (hostPlayer) setHost(hostPlayer.id);
    });

    const unsubInitializeGame = subscribe("initializeGame", () => {
      setScreen("game");
    });

    const unsubPlayerLeft = subscribe("playerLeft", ({ uuid }) => {
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== uuid));
    });

    const unsubLeaveRoom = subscribe("leaveRoomResult", () => {
      setMenu("roomOptions");
    });

    return () => {
      unsubPlayerListUpdate();
      unsubInitializeGame();
      unsubPlayerLeft();
      unsubLeaveRoom();
    };
  }, []);

  const toggleReady = (ready) => {
    send({ type: "readyUp", ready: !ready });
  };

  const initializeGame = () => {
    send({ type: "initializeGame" });
  };

  const allReady = players.length > 1 && players.every((p) => p.ready) && id === host;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-2xl text-center">Room #{roomPIN}</h2>

      <ul className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => {
          const player = players[i];
          return (
            <li key={i} className={`p-5 border-3 rounded-xl border-gray-300 min-h-[170px] ${player ? (player.ready ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50") : "border-gray-300 bg-white"}`}>
              {player ? (
                <div className="flex flex-col justify-center">
                  <h2 className="text-center text-xl font-semibold">{player.username}</h2>
                  {player.id === host && <p className="text-center">(Host)</p>}
                  <p className="text-center p-2">{player.ready ? "Ready" : "Not Ready"}</p>
                  {player.id === id && <button onClick={() => toggleReady(player.ready)}>{player.ready ? "Unready" : "Ready Up"}</button>}
                </div>
              ) : (
                <div className="text-gray-400 italic">Waiting for player...</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="grid justify-center">
        {id === host ? (
          <button onClick={initializeGame} disabled={!allReady}>
            Start Game
          </button>
        ) : (
          <p className="text-center">Please wait for the host to start the game.</p>
        )}
        <button onClick={() => send({ type: "leaveRoom" })}>Leave Room</button>
      </div>
    </div>
  );
}
