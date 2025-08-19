import { createContext, useContext } from "react";

export const PlayerColourContext = createContext({});
export const playerColourMap = () => useContext(PlayerColourContext);
