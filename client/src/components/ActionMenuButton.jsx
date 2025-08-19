import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resources } from "../utils/resources";
import { playerColourMap } from "../context/PlayerColourContext";
import { hoverTextMap } from "../utils/colours";
import { useSocket } from "../context/WebSocketContext";

function ActionMenuButton({ icon, onClick, disabled = false, title }) {
  const { id } = useSocket();
  const colourMap = playerColourMap();
  const playerColour = colourMap[id];
  const hoverClass = disabled ? "opacity-30 cursor-default" : hoverTextMap[playerColour] || "hover:text-gray-400";
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-md p-2
      ${hoverClass}`}
    >
      {resources.includes(icon) ? <img src={`/icons/${icon}.png`} alt={`${icon} icon`} className="w-10 h-10" /> : <FontAwesomeIcon icon={icon} className="text-3xl xl:text-5xl" />}
    </button>
  );
}
export default ActionMenuButton;
