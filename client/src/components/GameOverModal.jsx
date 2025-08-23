import { useSocket } from "../context/WebSocketContext";
import { useState, useEffect } from "react";
import { playerColourMap } from "../context/PlayerColourContext";
import { resources } from "../utils/resources";
import { textColourMap, panelBgClasses, borderColourMap } from "../utils/colours";

const GameOverModal = ({ winnerData }) => {
  const { send, id } = useSocket();
  const playerColour = playerColourMap()[winnerData.winnerId];
  const textColourClass = textColourMap[playerColour];

  const onClose = () => {
    send({ type: "endGame" });
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <img src={`/icons/crown.png`} className="w-20 h-20" />
          </div>
          <h2 className={`text-center pb-3 pt-2 text-2xl font-bold`}>Game Over!</h2>
          <p className={`text-center pb-5 font-semibold`}>{winnerData.winner.username} won!</p>
          <button onClick={onClose}>Good Game</button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
