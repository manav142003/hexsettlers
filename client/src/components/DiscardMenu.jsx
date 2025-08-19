import { useState } from "react";
import { useSocket } from "../context/WebSocketContext";

const flattenResources = (resources) => {
  const cards = [];
  for (const [type, amount] of Object.entries(resources)) {
    for (let i = 0; i < amount; i++) {
      cards.push({ type, id: `${type}-${i}` });
    }
  }
  return cards;
};

const DiscardMenu = ({ count, resources, onComplete }) => {
  const { send } = useSocket();
  const cards = flattenResources(resources); //generate an array of the player's individual cards
  const [selected, setSelected] = useState([]); //tracks which cards the player has selected to discard

  //select / deselect resources to be discarded
  const toggleSelect = (cardId) => {
    if (selected.includes(cardId)) {
      setSelected(selected.filter((id) => id !== cardId));
    } else if (selected.length < count) {
      setSelected([...selected, cardId]);
    }
  };

  const confirm = () => {
    const selectedCards = cards.filter((card) => selected.includes(card.id));
    const resources = {};

    //get the selected cards in the ie. {resourceType: 5} format
    for (const card of selectedCards) {
      resources[card.type] = (resources[card.type] || 0) + 1;
    }

    send({ type: "discardResources", resources });
    onComplete();
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h3 className="font-bold text-center text-2xl px-5 pt-5 pb-2">Discard</h3>
        <p className="text-center">{`A 7 was rolled. Please discard ${count} resources!`}</p>
        <p className="text-center pt-1 pb-5 font-semibold">
          Selected: {selected.length} / {count}
        </p>
        <div className="flex flex-wrap justify-center">
          {cards.map((card) => (
            <button key={card.id} onClick={() => toggleSelect(card.id)} style={{ borderColor: selected.includes(card.id) ? "crimson" : "lightgray" }}>
              <img className="w-10 h-10 xl:w-20 xl:h-20" src={`/icons/${card.type}.png`} alt={`${card.type} icon`} />
            </button>
          ))}
        </div>

        <div className="flex justify-center p-5">
          <button onClick={confirm} disabled={selected.length !== count}>
            Confirm Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardMenu;
