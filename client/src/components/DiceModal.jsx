import { useSocket } from "../context/WebSocketContext";
import { useEffect, useState } from "react";

const Dice = ({ rolling, number }) => {
  const [shuffleNumber, setShuffleNumber] = useState(1);

  useEffect(() => {
    let interval;

    if (rolling) {
      interval = setInterval(() => {
        setShuffleNumber(Math.floor(Math.random() * 6) + 1);
      }, 100); // change every 100ms
    }

    return () => clearInterval(interval); // cleanup on unmount or stop
  }, [rolling]);

  const value = rolling ? shuffleNumber : number;
  const activeDots = pipMap[value] || [];

  return (
    <div className="w-24 h-24 rounded-lg bg-white border-4 border-gray-300 grid grid-cols-3 grid-rows-3 gap-1 p-2">
      {[...Array(9)].map((_, idx) => (
        <span key={idx} className={`w-full h-full flex items-center justify-center`}>
          {activeDots.includes(idx) && <span className="w-3 h-3 bg-black rounded-full" />}
        </span>
      ))}
    </div>
  );
};

const pipMap = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const DiceModal = ({ onComplete }) => {
  const { send, subscribe } = useSocket();
  const [rolling, setRolling] = useState(true);
  const [finalRoll, setFinalRoll] = useState(null);

  useEffect(() => {
    const unsubDiceResult = subscribe("diceResult", (data) => {
      setFinalRoll({ dice1: data.dice1, dice2: data.dice2 });
      setRolling(false);

      setTimeout(() => {
        onComplete();
      }, 1000);
    });

    return () => unsubDiceResult;
  }, [subscribe, onComplete]);

  const handleDiceRoll = () => {
    send({ type: "rollDice" });
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-4 text-2xl font-bold">Roll the Dice</h2>
        <div className="flex flex-col justify-center gap-5">
          <div className="flex justify-center items-center gap-10">
            <Dice rolling={rolling} number={finalRoll?.dice1 || 1} />
            <Dice rolling={rolling} number={finalRoll?.dice2 || 1} />
          </div>
          <button onClick={handleDiceRoll}>Roll Dice</button>
        </div>
      </div>
    </div>
  );
};

export default DiceModal;
