import { useSocket } from "../context/WebSocketContext";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { playerColourMap } from "../context/PlayerColourContext";
import { resources } from "../utils/resources";
import { hoverTextMap, colourHexMap } from "../utils/colours";

const BankMenu = ({ onComplete, options }) => {
  const { send, id } = useSocket();
  const playerColour = playerColourMap()[id];
  const hoverClass = hoverTextMap[playerColour];
  const borderColour = colourHexMap[playerColour];
  const [selectedGive, setSelectedGive] = useState(null);
  const [selectedReceive, setSelectedReceive] = useState(null);

  const makeExchange = () => {
    if (selectedGive && selectedReceive) {
      send({ type: "bankTrade", give: selectedGive, receive: selectedReceive });
      setSelectedGive(null);
      setSelectedReceive(null);
      onComplete();
    }
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-5 text-2xl font-bold">Bank</h2>

        <div>
          <h4 className="text-xl font-semibold mb-2">Give:</h4>
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            {options.map((option, idx) => (
              <div key={idx}>
                {Object.entries(option.give).map(([resource, amount]) => (
                  <button key={resource} onClick={() => setSelectedGive(option.give)} style={selectedGive === option.give ? { border: `2px solid ${borderColour}` } : {}}>
                    <img className="w-16 h-16" src={`/icons/${resource}.png`} alt={`${resource} icon`} />
                    <p className="text-sm font-medium">x{amount}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>

          <h4 className="text-xl font-semibold mt-6 mb-2">Receive:</h4>
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            {resources.map((resource) => (
              <button key={resource} onClick={() => setSelectedReceive(resource)} style={selectedReceive === resource ? { border: `2px solid ${borderColour}` } : {}}>
                <img className="w-16 h-16" src={`/icons/${resource}.png`} alt={`${resource} icon`} />
                <p className="text-sm">x1</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 p-5">
          <button className={hoverClass} onClick={() => makeExchange()} disabled={!selectedGive || !selectedReceive}>
            Confirm
          </button>
          <button className={hoverClass} onClick={onComplete}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankMenu;
