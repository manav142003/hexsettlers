import { useSocket } from "../context/WebSocketContext";

const MonopolyMenu = ({ onComplete }) => {
  const { send } = useSocket();

  const handleMonopoly = (resource) => {
    send({ type: "monopoly", resource });
    onComplete();
  };

  const resources = ["wood", "brick", "sheep", "wheat", "ore"];

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-4 text-2xl font-bold">Monopoly</h2>
        <p className="text-center pb-5">Call a monopoly on one resource!</p>
        <div className="flex flex-col xl:flex-row items-center justify-center gap-4 p-5">
          {resources.map((resource) => (
            <button key={resource} className="flex justify-center" onClick={() => handleMonopoly(resource)}>
              <img className="w-20 h-20" src={`/icons/${resource}.png`} alt={resource} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonopolyMenu;
