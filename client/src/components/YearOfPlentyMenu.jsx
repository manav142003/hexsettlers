import { useSocket } from "../context/WebSocketContext";
import { useState } from "react";

const YearOfPlentyMenu = ({ onComplete }) => {
  const { send } = useSocket();
  const [selected, setSelected] = useState([]);

  const selectResource = (resource) => {
    if (selected.length < 2) setSelected([...selected, resource]);
  };

  const removeResource = (index) => {
    setSelected(selected.filter((_, i) => i != index));
  };

  const confirmSelection = () => {
    if (selected.length === 2) {
      send({ type: "yearOfPlenty", resources: selected });
      onComplete();
    }
  };

  const resources = ["wood", "brick", "sheep", "wheat", "ore"];
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h3>Year of Plenty</h3>
        <p>Select two resources!</p>

        <div>
          {resources.map((res) => (
            <button key={res} onClick={() => selectResource(res)} disabled={selected.length >= 2}>
              {res}
            </button>
          ))}
        </div>

        <div>
          {selected.map((res, index) => (
            <div key={index} className="selected-item">
              {res}
              <button onClick={() => removeResource(index)}>❌</button>
            </div>
          ))}
        </div>

        <button onClick={confirmSelection} disabled={selected.length !== 2}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default YearOfPlentyMenu;
