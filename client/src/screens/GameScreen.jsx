import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/WebSocketContext";
import GameBoard from "../components/GameBoard";
import ActionMenu from "../components/ActionMenu";
import DiscardMenu from "../components/DiscardMenu";
import MonopolyMenu from "../components/MonopolyMenu";
import YearOfPlentyMenu from "../components/YearOfPlentyMenu";
import TradeMenu from "../components/TradeMenu";
import PlayerInfo from "../components/PlayerInfo";
import PlayerColourProvider from "../context/PlayerColourProvider";
import { colourPalette } from "../utils/colours";
import StealMenu from "../components/StealMenu";
import ServerLogToast from "../components/ServerLogToast";
import GameOverModal from "../components/GameOverModal";
import GameAbortedModal from "../components/GameAbortedModal";
import { DifferencesProvider } from "../context/DifferencesContext";

export default function GameScreen({ setMenu, setScreen }) {
  const { send, subscribe, id } = useSocket();
  const [gameState, setGameState] = useState(null); //sets the current game state
  const [discardData, setDiscardData] = useState(null); //sets discard data (discard count, what resources you have, etc)
  const [discard, setDiscard] = useState(false); //toggles the discard screen when a 7 is rolled
  const [monopoly, setMonopoly] = useState(false); //toggles the monopoly screen when a monopoly card is played
  const [yearOfPlenty, setYearOfPlenty] = useState(false); //toggles the year of plenty screen when a year of plenty card is played
  const [tradeData, setTradeData] = useState(null); //sets trade data (offer, request, offering player, etc.)
  const [trade, setTrade] = useState(false); //toggles the trade screen when an opponent proposes a trade
  const [steal, setSteal] = useState(false); //toggles the stealing screen when a player moves the robber and attempts to steal from opponent
  const [stealData, setStealData] = useState(null);
  const [winnerData, setWinnerData] = useState(null);
  const [gameAborted, setGameAborted] = useState(null);
  const [abortedBy, setAbortedBy] = useState(null);

  useEffect(() => send({ type: "getGameState" }), []); //request the game state from the server

  useEffect(() => {
    const unsubGetGameState = subscribe("getGameState", (data) => {
      setGameState(data.gameState); //update the game's state
    });

    const unsubDiscardPrompt = subscribe("discardPrompt", (data) => {
      setDiscardData(data); //toggle the discard screen and data
      setDiscard((prev) => !prev);
    });

    const unsubMonopolyPrompt = subscribe("monopolyPrompt", () => {
      setMonopoly((prev) => !prev); //toggle the monopoly screen
    });

    const unsubYearOfPlentyPrompt = subscribe("yearOfPlentyPrompt", () => {
      setYearOfPlenty((prev) => !prev); //toggle the year of plenty screen
    });

    const unsubTradePrompt = subscribe("tradePrompt", (data) => {
      setTradeData(data); //toggle the trade screen to respond to trade proposals
      setTrade((prev) => !prev);
    });

    const unsubTradeComplete = subscribe("tradeComplete", () => {
      setTradeData(null); //turn off the trade screen once someone accepts or everyone declines trade
      setTrade(false);
    });

    const unsubStealPrompt = subscribe("stealPrompt", (data) => {
      //show the steal menu modal
      setStealData(data);
      setSteal((prev) => !prev);
    });

    const unsubGameAborted = subscribe("gameAborted", (data) => {
      //if someone disconnects, show modal saying that the game was disconnected
      setGameAborted(true);
      setAbortedBy(data.username);
    });

    const unsubGameOver = subscribe("gameOver", (data) => {
      //show game over modal
      setWinnerData(data);
    });

    const unsubReturnToLobby = subscribe("returnToLobby", (data) => {
      //after clicking "good game" when someone wins, return to lobby screen
      setMenu("lobby");
      setScreen("home");
    });

    return () => {
      unsubGetGameState();
      unsubDiscardPrompt();
      unsubMonopolyPrompt();
      unsubYearOfPlentyPrompt();
      unsubTradePrompt();
      unsubTradeComplete();
      unsubStealPrompt();
      unsubGameOver();
      unsubGameAborted();
      unsubReturnToLobby();
    };
  }, [subscribe, send, id]);

  if (!gameState) return;

  const closeDiscard = () => {
    setDiscardData(null);
    setDiscard(!discard);
  };

  const closeSteal = () => {
    setStealData(null);
    setSteal(!steal);
  };

  const closeGameAborted = () => {
    setGameAborted(false);
    setAbortedBy(null);
    setMenu("lobby");
    setScreen("home");
  };

  const isYourTurn = id === gameState.turnOrder[gameState.turn];

  return (
    <PlayerColourProvider playerId={id} turnOrder={gameState.turnOrder} colourPalette={colourPalette}>
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 md:px-20">
        <ServerLogToast />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex items-center justify-center rounded-2xl shadow-lg border-6 border-gray-300 bg-[#0771B8] z-0">
              <GameBoard gameState={gameState} isYourTurn={isYourTurn} />
            </div>

            <div className="xl:flex xl:flex-1 xl:order-first">
              <ActionMenu isYourTurn={isYourTurn} action={gameState.action} phase={gameState.phase} devCards={gameState.players[id].devCards} resources={gameState.players[id].resources} />
            </div>
          </div>

          <div>
            <DifferencesProvider>
              <PlayerInfo players={gameState.players} currentPlayerId={gameState.turnOrder[gameState.turn]} turnOrder={gameState.turnOrder} resources={gameState.players[id].resources} />
            </DifferencesProvider>
          </div>
        </div>

        {/* MODAL MENUS (discard prompt, monopoly, year of plenty, trading) */}
        {discard && <DiscardMenu count={discardData.count} resources={discardData.resources} onComplete={closeDiscard} />}
        {monopoly && <MonopolyMenu onComplete={() => setMonopoly(false)} />}
        {yearOfPlenty && <YearOfPlentyMenu onComplete={() => setYearOfPlenty(false)} />}
        {trade && <TradeMenu mode="respond" tradeData={tradeData} playerResources={gameState.players[id].resources} onComplete={() => setTrade(false)} />}
        {steal && <StealMenu stealData={stealData} onComplete={closeSteal} />}
        {winnerData && <GameOverModal winnerData={winnerData} />}
        {gameAborted && <GameAbortedModal username={abortedBy} onClose={closeGameAborted} />}
      </div>
    </PlayerColourProvider>
  );
}
