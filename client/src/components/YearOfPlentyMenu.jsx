import { useSocket } from "../context/WebSocketContext";
import { useState } from "react";

const YearOfPlentyMenu = ({ onComplete }) => {
  const { send } = useSocket();
  const [selected, setSelected] = useState([]);

  const selectResource = (resource) => {
    if (selected.length < 2) setSelected([...selected, resource]);
  };

  const undoSelection = () => {
    setSelected([]);
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
        <h2 className="text-center p-4 text-2xl font-bold">Year of Plenty</h2>
        <p className="text-center pb-5">Select two free resources!</p>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-4 p-5">
          {resources.map((res) => {
            const count = selected.filter((r) => r === res).length;
            return (
              <button key={res} onClick={() => selectResource(res)} className="flex flex-col items-center">
                <img className="w-20 h-20" src={`/icons/${res}.png`} alt={res} />
                {count > 0 && <p className="text-sm font-semibold">x{count}</p>}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button onClick={undoSelection} disabled={selected.length === 0} className="px-4 py-2 border rounded disabled:opacity-50">
            Undo Selection
          </button>
          <button onClick={confirmSelection} disabled={selected.length !== 2} className="px-4 py-2 border rounded disabled:opacity-50">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearOfPlentyMenu;
