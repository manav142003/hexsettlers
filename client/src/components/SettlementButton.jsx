import { useSocket } from "../context/WebSocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCity } from "@fortawesome/free-solid-svg-icons";
import { colourPalette } from "../utils/colours";
import { playerColourMap } from "../context/PlayerColourContext";
import { hoverBgMap } from "../utils/colours";

export default function SettlementButton({ radius, coords, settlementId, disabled, owner, mode, structureType }) {
  const { send, id } = useSocket();
  const playerColour = playerColourMap()[id];
  const hoverClass = hoverBgMap[playerColour];

  const colour = owner === -1 ? "white" : colourPalette[owner];

  const handlePlacement = (location) => {
    if (mode === "city") send({ type: "placeCity", location });
    else send({ type: "placeSettlement", location });
  };

  const style = {
    position: "absolute",
    left: `${coords.x}px`,
    top: `${coords.y}px`,
    transform: "translate(-50%, -50%)",
    pointerEvents: "auto",
  };

  const buttonStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "2px solid lightgrey",
    background: colour,
    cursor: "pointer",
    display: disabled ? "none" : "block",
  };

  if (!disabled) {
    //if the button is enabled, return the button to place the settlement/city
    return <button className={`animate-pulse ${hoverClass}`} style={{ ...style, ...buttonStyle }} onClick={() => handlePlacement(settlementId)} disabled={disabled}></button>;
  } else if (owner !== -1) {
    //if the vertex has an owner, determine the type of structure and put that icon here
    const icon = structureType === "city" ? faCity : faHouse;
    return <FontAwesomeIcon icon={icon} style={{ ...style, fontSize: radius / 2.5, color: colour }} />;
  }
}
