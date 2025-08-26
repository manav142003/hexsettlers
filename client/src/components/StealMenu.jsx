import { useSocket } from "../context/WebSocketContext";
import { useState } from "react";
import { playerColourMap } from "../context/PlayerColourContext";
import { hoverTextMap, colourHexMap } from "../utils/colours";
import FlipCard from "./FlipCard";

const StealMenu = ({ stealData, onComplete }) => {
  const { send, id } = useSocket();
  const playerColour = playerColourMap()[id];
  const hoverClass = hoverTextMap[playerColour];
  const borderColour = colourHexMap[playerColour];
  const [selectedVictim, setSelectedVictim] = useState(null);

  const { victims } = stealData;

  const handleSkip = () => {
    send({ type: "steal", victimId: null });
    onComplete();
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-5 text-2xl font-bold">Steal</h2>
        <p className="text-center">Steal from an opponent!</p>

        {!selectedVictim ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center">Select opponent:</p>
            {victims.map((victim) => (
              <button key={victim.uuid} className={`${hoverClass} border-2 px-4 py-2`} onClick={() => setSelectedVictim(victim)}>
                {victim.username}
              </button>
            ))}
            <button className={`${hoverClass} mt-2`} onClick={handleSkip}>
              Skip Steal
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center">Choose one of {selectedVictim.username}'s resources:</p>
            <div className="flex gap-3 flex-wrap justify-center">
              {Array.from({ length: selectedVictim.resourceCount }).map((_, idx) => (
                <FlipCard key={idx} victimId={selectedVictim.uuid} onComplete={onComplete} />
              ))}
            </div>
            <button className={`${hoverClass} mt-4`} onClick={() => setSelectedVictim(null)}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StealMenu;
