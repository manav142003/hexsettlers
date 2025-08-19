import { useSocket } from "../context/WebSocketContext";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { playerColourMap } from "../context/PlayerColourContext";
import { resources } from "../utils/resources";
import { hoverTextMap, colourHexMap } from "../utils/colours";

const DevCardMenu = ({ onComplete, devCards, devCardActions }) => {
  const { send, id } = useSocket();
  const playerColour = playerColourMap()[id];
  const hoverClass = hoverTextMap[playerColour];
  const [menu, setMenu] = useState("main");

  //purchase a development card
  const purchaseCard = () => {
    send({ type: "purchaseDevCard" });
    onComplete();
  };

  //play a chosen development card
  const playCard = (card, index) => {
    send({ type: "playDevCard", card, index });
    onComplete();
  };

  //check if the player has a playable development card
  const hasPlayableDevCard = (devCards) => {
    if (!devCards) return false;
    return devCards.some((card) => {
      return !card.locked && !card.played;
    });
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-5 text-2xl font-bold">Development Cards</h2>

        {menu === "main" ? (
          <div>
            <button title={devCardActions.description} className={hoverClass} disabled={!devCardActions?.allowed} onClick={() => purchaseCard()}>
              Purchase Card
            </button>
            <button disabled={!hasPlayableDevCard(devCards)} onClick={() => setMenu("devCards")}>
              Play Card
            </button>

            <button className={hoverClass} onClick={onComplete}>
              Back
            </button>
          </div>
        ) : (
          <div>
            {devCards.map((card, i) => (
              <button className={hoverClass} key={i} onClick={() => playCard(card, i)} disabled={card.locked || card.played}>
                {card.type}
              </button>
            ))}
            <button className={hoverClass} onClick={() => setMenu("main")}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevCardMenu;
