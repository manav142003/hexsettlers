import React, { useState } from "react";
import { useSocket } from "../context/WebSocketContext";

export default function RoomPinModal({ onComplete }) {
  const [pin, setPin] = useState("");
  const { send } = useSocket();

  const joinRoom = (pin) => {
    send({ type: "joinRoom", pin });
  };

  const isValidPIN = /^\d{4}$/.test(pin);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      // limit digits if needed
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <div className="flex flex-col justify-center">
          <h2 className="text-center p-4 text-2xl font-bold">Enter Room Code</h2>

          <div className="flex justify-center flex-col gap-5">
            <input
              className="border border-gray-500 rounded-xl px-6 py-3 text-lg"
              placeholder="ROOM PIN"
              value={pin}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,4}$/.test(value)) setPin(e.target.value);
              }}
            />
            <div>
              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button key={num} onClick={() => handleNumberClick(num)} className="bg-white shadow rounded-lg p-4 text-lg font-bold hover:bg-gray-100">
                    {num}
                  </button>
                ))}
                <button onClick={handleClear} className="bg-red-200 shadow rounded-lg p-4 text-lg font-bold hover:bg-red-300">
                  C
                </button>
                <button onClick={() => handleNumberClick(0)} className="bg-white shadow rounded-lg p-4 text-lg font-bold hover:bg-gray-100">
                  0
                </button>
                <button onClick={handleBackspace} className="bg-yellow-200 shadow rounded-lg p-4 text-lg font-bold hover:bg-yellow-300">
                  ⌫
                </button>
              </div>
              <div className="flex justify-center">
                <button disabled={!isValidPIN} onClick={() => joinRoom(pin)}>
                  Join Room
                </button>
                <button onClick={() => onComplete()}>Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
