import { useSocket } from "../context/WebSocketContext";

export default function TileButton({ radius, coords, tileId, number, disabled, hasRobber }) {
  const { send, id } = useSocket();

  const placeRobber = (tile) => {
    if (disabled) return;
    send({ type: "placeRobber", tile });
  };

  const style = {
    position: "absolute",
    left: `${coords.x}px`,
    top: `${coords.y}px`,
    transform: "translate(-50%, -50%)",
    width: `${radius / 1.3}px`,
    height: `${radius / 1.3}px`,
    borderRadius: "50%",
    pointerEvents: "auto",
    cursor: disabled ? "auto" : "pointer",
    margin: "0px",
  };

  return <img onClick={() => placeRobber(tileId)} className={disabled ? "" : "animate-pulse"} style={style} src={`/tilebuttons/${hasRobber ? "robber" : number === 7 ? "blank" : number}.png`} />;
}
