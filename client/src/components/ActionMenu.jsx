import { useSocket } from "../context/WebSocketContext";
import { useState, useEffect } from "react";
import ServerLog from "./ServerLog";
import TradeMenu from "./TradeMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCity, faRoad, faBuildingColumns, faArrowRightArrowLeft, faComments, faForwardStep, faCartShopping, faRectangleList, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import ActionMenuButton from "./ActionMenuButton";
import DiceModal from "./DiceModal";
import BankMenu from "./BankMenu";
import DevCardMenu from "./DevCardMenu";

const ActionMenu = ({ isYourTurn, action, phase, devCards, resources }) => {
  const { send, subscribe, id } = useSocket();
  const [actions, setActions] = useState({});
  const [menuMode, setMenuMode] = useState("mainMenu");
  const [tradeMenu, setTradeMenu] = useState(false);
  const [diceMenu, setDiceMenu] = useState(false);
  const [bankMenu, setBankMenu] = useState(false);
  const [devCardMenu, setDevCardMenu] = useState(false);

  const handleEndTurn = () => {
    send({ type: "turnComplete" });
    setActions({});
    setMenuMode("mainMenu");
  };

  useEffect(() => {
    const unsubSelectAction = subscribe("selectAction", (data) => {
      setActions(data.possibleActions); //set the possible actions that a player can make (to enable/disable buttons)
    });
    return () => unsubSelectAction();
  }, [subscribe, send, id]);

  useEffect(() => {
    if (action === "roll") setDiceMenu(true);
  }, [action]);

  //most buttons are disabled if either it's not your turn or if that action is invalid based on the game state
  const isDisabled = (actionName) => !actions[actionName]?.allowed || !isYourTurn || action === "robber";

  return (
    <div className="border-6 bg-gray-200 border-gray-300 rounded-lg p-4  w-full">
      {menuMode === "mainMenu" && (
        <div className="grid grid-cols-4 gap-5 xl:grid-cols-2 w-full h-full">
          <ActionMenuButton icon={faHouse} disabled={isDisabled("placeSettlement")} onClick={() => send({ type: "requestSettlementPrompt" })} />
          <ActionMenuButton icon={faRoad} disabled={isDisabled("placeRoad")} onClick={() => send({ type: "requestRoadPrompt" })} />
          <ActionMenuButton icon={faCity} disabled={isDisabled("placeCity")} onClick={() => send({ type: "requestCityPrompt" })} />
          <ActionMenuButton icon={faRectangleList} disabled={!(isYourTurn && action !== "roll" && action !== "robber")} onClick={() => setDevCardMenu(true)} />
          <ActionMenuButton icon={faArrowRightArrowLeft} disabled={isDisabled("trade")} onClick={() => setTradeMenu(true)} />
          <ActionMenuButton icon={faBuildingColumns} disabled={isDisabled("bank")} onClick={() => setBankMenu(true)} />
          <ActionMenuButton icon={faForwardStep} disabled={!(isYourTurn && action !== "roll" && action !== "robber") || phase === "setup"} onClick={handleEndTurn} />
          <ActionMenuButton icon={faComments} onClick={() => setMenuMode("messages")} />
        </div>
      )}

      <ServerLog enabled={menuMode === "messages"} onBack={() => setMenuMode("mainMenu")} />
      {devCardMenu && <DevCardMenu onComplete={() => setDevCardMenu(false)} devCards={devCards} devCardActions={actions.buyDevCard} />}
      {bankMenu && <BankMenu onComplete={() => setBankMenu(false)} options={actions.bank.options} />}
      {tradeMenu && <TradeMenu mode="propose" playerResources={resources} onComplete={() => setTradeMenu(false)} />}
      {diceMenu && isYourTurn && <DiceModal onComplete={() => setDiceMenu(false)} />}
    </div>
  );
};
export default ActionMenu;
