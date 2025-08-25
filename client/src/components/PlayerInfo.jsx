import { useEffect, useState } from "react";
import { useSocket } from "../context/WebSocketContext";
import { colourPalette, panelBgClasses } from "../utils/colours";
import { textColourMap, borderColourMap } from "../utils/colours";
import StatGainFloat from "./StatGainFloat";
import { useDifferences } from "../context/DifferencesContext";

var playerColour = "gray";

function PlayerInfoPanel({ playerId, player, currentPlayerId, isYou, turnOrder, resources }) {
  const playerIndex = Array.isArray(turnOrder) ? turnOrder.indexOf(playerId) : -1;
  playerColour = colourPalette[playerIndex] || "gray";

  //if it's currently this player's turn, their border will be thicker
  const isCurrentPlayer = playerId === currentPlayerId;
  const borderThickness = isCurrentPlayer ? "border-6" : "border-6";
  const borderColourClass = isCurrentPlayer ? borderColourMap[playerColour] : "border-gray-300";
  const bgClass = panelBgClasses[playerColour];

  return isYou ? (
    //for you, we display name, victory points, resource types/counts, dev card count, longest road, army size
    <div className={`flex flex-col justify-center rounded-lg p-4 mb-2 lg:h-full ${bgClass} ${borderThickness} ${borderColourClass} `}>
      <YourStatsDisplay player={player} resources={resources} playerId={playerId} />
    </div>
  ) : (
    //for opponents, we display their name, victory points, army size, longest road, resource count, and dev card count
    <div className={`flex flex-col justify-center rounded-lg p-3 mb-2 lg:h-full ${bgClass}  ${borderThickness} ${borderColourClass}`}>
      <OpponentStatsDisplay player={player} playerId={playerId} />
    </div>
  );
}

//display for the main player's stats
function YourStatsDisplay({ player, resources, playerId }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 items-center lg:grid-cols-1 xl:grid-cols-3">
        <h3 className={`px-5 text-2xl font-bold col-span-2 md:col-span-1 md:col-start-2 md:text-center lg:col-start-1 lg:col-span-2 ${textColourMap[playerColour]}`}>{player.username}</h3>
        <VictoryPointDisplay victoryPoints={player.victoryPoints} playerId={playerId} />
      </div>

      <ResourceDisplay resources={resources} playerId={playerId} />
      <div className="flex justify-evenly">
        <StatDisplay type="longestRoad" player={player} playerId={playerId} />
        <StatDisplay type="army" player={player} playerId={playerId} />
        <StatDisplay type="devCard" player={player} playerId={playerId} />
      </div>
    </div>
  );
}

function VictoryPointDisplay({ victoryPoints, playerId }) {
  const { differences } = useDifferences();
  const diff = differences?.differences?.[playerId]?.victoryPoints;
  const eventId = differences?.eventId;
  return (
    <div className="flex items-center justify-end gap-2 px-5 lg:justify-center">
      <img src={`/icons/crown.png`} className=" lg:object-contain w-10 h-10 lg:w-20 lg:h-20" />
      <StatGainFloat amount={diff} triggerKey={eventId} />
      <h3 className={`text-2xl font-bold ${textColourMap[playerColour]}`}>{victoryPoints}</h3>
    </div>
  );
}

//display for an opponent's stats
function OpponentStatsDisplay({ player, playerId }) {
  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-3 gap-3 items-center lg:grid-cols-1 xl:grid-cols-3">
        <h3 className={`px-5 text-lg font-bold col-span-2 md:col-span-1 md:col-start-2 md:text-center  lg:col-start-1 lg:col-span-2 ${textColourMap[playerColour]}`}>{player.username}</h3>
        <VictoryPointDisplay victoryPoints={player.victoryPoints} playerId={playerId} />
      </div>

      <div className="grid px-5 gap-2 justify-evenly grid-cols-4 lg:grid-cols-2">
        <StatDisplay type="resource" player={player} playerId={playerId} />
        <StatDisplay type="longestRoad" player={player} playerId={playerId} />
        <StatDisplay type="army" player={player} playerId={playerId} />
        <StatDisplay type="devCard" player={player} playerId={playerId} />
      </div>
    </div>
  );
}

function StatDisplay({ type, player, playerId }) {
  const { differences } = useDifferences();
  const key = `${type}Count`;
  const count = player[key];
  const diff = differences?.differences?.[playerId]?.[key];
  const eventId = differences?.eventId;
  return (
    <div className="flex flex-col items-center">
      <img src={`/icons/${type}.png`} className="w-10 h-10 lg:w-20 lg:h-20" />
      <StatGainFloat amount={diff} triggerKey={eventId} />
      <p className={`text-center font-bold ${textColourMap[playerColour]}`}>{count}</p>
    </div>
  );
}

//displays each resource icon and amount
function ResourceDisplay({ resources, playerId }) {
  const { differences } = useDifferences();
  if (!resources) return null;
  return (
    <div className="flex justify-center gap-4 py-2">
      {Object.entries(resources).map(([resource, count]) => {
        const diff = differences?.differences?.[playerId]?.[resource];
        const eventId = differences?.eventId;
        return (
          <div className="flex flex-col items-center" key={resource}>
            <img className="object-contain w-10 h-10 lg:w-20 lg:h-20" src={`/icons/${resource}.png`} alt={resource} />
            <p className={`font-bold ${textColourMap[playerColour]}`}>{count}</p>
            <StatGainFloat amount={diff} triggerKey={eventId} />
          </div>
        );
      })}
    </div>
  );
}

//PlayerInfo is the entire div with all player cards
export default function PlayerInfo({ players, currentPlayerId, turnOrder, resources }) {
  const { id, subscribe } = useSocket();

  const { setDifferences } = useDifferences();

  useEffect(() => {
    const unsubStatDifferences = subscribe("statDifferences", (data) => {
      setDifferences({ differences: data.differences, eventId: data.eventId });
    });

    return () => unsubStatDifferences();
  }, [setDifferences]);

  const yourIndex = turnOrder.findIndex((playerId) => String(playerId) === String(id));
  const orderedPlayerIds = [...turnOrder.slice(yourIndex), ...turnOrder.slice(0, yourIndex)];
  return (
    <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-stretch">
      {orderedPlayerIds.map((playerId) => {
        const player = players[playerId];
        return (
          <div key={playerId} className={id === playerId ? "flex-[1.5]" : "flex-1"}>
            <PlayerInfoPanel playerId={playerId} player={player} currentPlayerId={currentPlayerId} isYou={id === playerId} turnOrder={turnOrder} resources={resources} />
          </div>
        );
      })}
    </div>
  );
}
