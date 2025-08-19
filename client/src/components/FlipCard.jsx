import { useEffect, useState } from "react";
import { useSocket } from "../context/WebSocketContext";
import { hoverTextMap, colourHexMap } from "../utils/colours";
import { playerColourMap } from "../context/PlayerColourContext";

const FlipCard = ({ victimId, onComplete }) => {
  const { send, subscribe, id } = useSocket();
  const [flipped, setFlipped] = useState(false);
  const [revealedResource, setRevealedResource] = useState(null);
  const playerColour = playerColourMap()[id];
  const hoverClass = hoverTextMap[playerColour];
  const borderColour = colourHexMap[playerColour];

  useEffect(() => {
    const unsub = subscribe("stealResult", (data) => {
      setRevealedResource(data.resource);
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    });

    return () => unsub();
  }, [subscribe, onComplete]);

  const handleClick = () => {
    if (flipped) return;
    send({ type: "steal", victimId });
    setFlipped(true);
  };

  return (
    <div className="card-container" onClick={handleClick}>
      <div className={`card ${flipped ? "flipped" : ""}`}>
        <div className={`card-face card-front cursor-pointer `}>?</div>
        <div className="card-face card-back">{revealedResource ? <img src={`/icons/${revealedResource}.png`} alt={revealedResource} className="w-16 h-16" /> : "..."}</div>
      </div>
    </div>
  );
};

export default FlipCard;
