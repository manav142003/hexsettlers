import { PlayerColourContext } from "./PlayerColourContext";

function PlayerColourProvider({ turnOrder, colourPalette, children }) {
  // Map player UUIDs to colors
  const colourMap = Array.isArray(turnOrder) ? Object.fromEntries(turnOrder.map((uuid, i) => [uuid, colourPalette?.[i] || "gray"])) : {};

  return <PlayerColourContext.Provider value={colourMap}>{children}</PlayerColourContext.Provider>;
}

export default PlayerColourProvider;
