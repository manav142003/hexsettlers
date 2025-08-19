import { useSocket } from "../context/WebSocketContext";
import { colourPalette } from "../utils/colours";

export default function RoadButton({ radius, from, to, disabled, coords, owner, setValidRoads }) {
  const { send } = useSocket();

  const placeRoad = (from, to) => {
    //send the road placement to the server, then reset the valid road buttons since they will be changing
    send({ type: "placeRoad", from, to });
    setValidRoads([]);
  };

  const colour = owner === -1 ? "white" : colourPalette[owner];

  const [x1, y1] = coords.a;
  const [x2, y2] = coords.b;
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const style = {
    position: "absolute",
    left: `${centerX}px`,
    top: `${centerY}px`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    transformOrigin: "center",
    pointerEvents: "auto",
    padding: `${radius / 12}px`,
    width: `${radius / 2}px`,
    margin: "0px",
    background: colour,
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  if (owner !== -1) {
    return <button style={{ ...style, cursor: "default" }} disabled></button>;
    //return <FontAwesomeIcon icon={faRoad} style={{ ...style, fontSize: "16px", color: colour }} />;
  } else return <button className="animate-pulse" style={{ ...style, display: disabled ? "none" : "block" }} onClick={() => placeRoad(from, to)} disabled={disabled}></button>;
}
