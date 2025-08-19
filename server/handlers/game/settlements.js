const { rooms, playerToRoom } = require("../../store");
const { broadcastToRoom, broadcastToPlayer } = require("../../utils/broadcast");
const { adjacentVertices, canAfford, chargePlayer, getContext } = require("../../data/gameHelpers");
const { promptRoadPlacement } = require("./roads");

//TODO: promptCityPlacement (highlight all settlement buttons to be able to be clicked on)
//TODO: getValidCityPlacements (return all of the player's settlements)
//TODO: placeCity (whichever settlement they chose, remove that one from settlements and add to city list)

module.exports = { placeSettlement, getValidSettlementPlacements, promptSettlementPlacement };
