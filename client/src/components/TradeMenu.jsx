import { useSocket } from "../context/WebSocketContext";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { playerColourMap } from "../context/PlayerColourContext";
import { resources } from "../utils/resources";
import { hoverTextMap } from "../utils/colours";

const TradeMenu = ({ mode, tradeData, playerResources, onComplete }) => {
  const { send, subscribe, id } = useSocket();
  const [offer, setOffer] = useState({});
  const [request, setRequest] = useState({});
  const [tradePending, setTradePending] = useState(false);
  const [responses, setResponses] = useState(null);
  const playerColour = playerColourMap()[id];
  const hoverClass = hoverTextMap[playerColour];

  //when a trade is complete, reset all the trade states and call onComplete function
  useEffect(() => {
    const unsubTradeComplete = subscribe("tradeComplete", () => {
      setTradePending(false);
      setOffer({});
      setRequest({});
      onComplete();
    });

    const unsubTradeDeclined = subscribe("tradeDeclined", ({ numResponses, numResponders }) => {
      setResponses({ numResponses, numResponders });
    });

    return () => {
      unsubTradeComplete();
      unsubTradeDeclined();
    };
  }, [subscribe, id, onComplete]);

  //increment a specific resource
  const increment = (state, setState, resource) => {
    setState({ ...state, [resource]: (state[resource] || 0) + 1 });
  };

  //decrement a specific resource
  const decrement = (state, setState, resource) => {
    if ((state[resource] || 0) > 0) {
      const updated = { ...state };
      updated[resource] -= 1;
      if (updated[resource] === 0) delete updated[resource];
      setState(updated);
    }
  };

  //sends trade proposal to backend to prompt other players
  const proposeTrade = () => {
    if (Object.keys(offer).length && Object.keys(request).length) {
      send({ type: "proposeTrade", offer, request });
    }
    setTradePending(true);
  };

  //2 response options: accept or decline. onComplete takes the responders off of the modal menu
  const acceptTrade = (accepter, offerer, tradeOffer, tradeRequest) => {
    send({ type: "acceptTrade", accepter, offerer, offer: tradeOffer, request: tradeRequest });
    onComplete();
  };
  const declineTrade = () => {
    send({ type: "declineTrade" });
    onComplete();
  };

  const controls = (state, setState, label) => {
    return (
      <div>
        <h4 className="text-center font-bold">{label}</h4>
        {resources.map((resource) => (
          <div key={resource} className="flex items-center justify-center gap-2 mb-3">
            <img className="w-20 h-20" src={`/icons/${resource}.png`} alt={`${resource} icon`} />
            <span>{state[resource] || 0}</span>
            <button className={hoverClass} onClick={() => increment(state, setState, resource)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className={hoverClass} onClick={() => decrement(state, setState, resource)} disabled={(state[resource] || 0) === 0}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const offerControls = () => {
    return (
      <div>
        <h4 className="text-center font-bold">Offer</h4>
        {Object.entries(playerResources).map(([resource, count]) => (
          <div key={resource} className="flex items-center justify-center gap-2 mb-3">
            <img className="w-20 h-20" src={`/icons/${resource}.png`} alt={`${resource} icon`} />
            <span>{offer[resource] || 0}</span>
            <button className={hoverClass} onClick={() => increment(offer, setOffer, resource)} disabled={(offer[resource] || 0) >= count}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className={hoverClass} onClick={() => decrement(offer, setOffer, resource)} disabled={(offer[resource] || 0) === 0}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <h2 className="text-center p-5 text-2xl font-bold">{mode === "propose" ? "Propose Trade" : "Trade Request"}</h2>

        <div>
          {mode === "propose" && (
            <div>
              <div className="flex flex-col xl:flex-row xl:gap-5">
                {offerControls()}
                {controls(request, setRequest, "Request")}
              </div>

              <div className="flex justify-center p-5">
                {tradePending ? (
                  <div className="flex flex-col items-center w-full xl:flex-row xl:justify-evenly">
                    <p className="font-bold text-center xl:text-xl p-2">{responses ? `Responses: ${responses.numResponses}/${responses.numResponders}` : "Waiting for players to respond..."}</p>

                    <button className={hoverClass} onClick={() => send({ type: "cancelTrade" })}>
                      Cancel Trade
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button className={hoverClass} onClick={proposeTrade} disabled={!Object.keys(offer).length || !Object.keys(request).length || tradePending}>
                      Propose Trade
                    </button>
                    <button className={hoverClass} onClick={onComplete}>
                      <FontAwesomeIcon icon={faLeftLong} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === "respond" && (
            <div>
              <p className="p-2 text-lg">{`${tradeData.player.username} is offering: `}</p>
              <div className="flex justify-center p-3">
                {Object.entries(tradeData.offer).length > 0 ? Object.entries(tradeData.offer).map(([resource, amount]) => Array.from({ length: amount }).map((_, i) => <img key={`${resource}-offer-${i}`} src={`/icons/${resource}.png`} alt={`${resource}`} className="w-20 h-20" />)) : <p>Nothing</p>}
              </div>

              <p className="p-2 text-lg">{`In exchange for: `}</p>
              <div className="flex justify-center p-3">
                {Object.entries(tradeData.request).length > 0 ? (
                  Object.entries(tradeData.request).map(([resource, amount]) => Array.from({ length: amount }).map((_, i) => <img key={`${resource}-request-${i}`} src={`/icons/${resource}.png`} alt={`${resource}`} className="w-20 h-20" />))
                ) : (
                  <p>Nothing</p>
                )}
              </div>
              <div className="flex justify-center p-3">
                <button disabled={!Object.entries(tradeData.request).every(([resource, amount]) => (playerResources[resource] || 0) >= amount)} className={hoverClass} onClick={() => acceptTrade(id, tradeData.uuid, tradeData.offer, tradeData.request)}>
                  Accept
                </button>
                <button className={hoverClass} onClick={() => declineTrade()}>
                  Decline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeMenu;
