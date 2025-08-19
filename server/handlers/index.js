module.exports = {
  joinRoom: require("./lobby/joinRoom").joinRoomByPIN, //sent when a player chooses to join a room with a PIN
  createRoom: require("./lobby/joinRoom").createRoom, //sent when a player chooses to create a room
  readyUp: require("./lobby/readyUp").handleReady, //sent when the player chooses to ready/unready
  initializeGame: require("./game/gameState").initializeGame, //sent when moving from lobby to game screen to initialize game
  getGameState: require("./game/gameState").getGameState, //sent whenever the entire gameState needs to be updated
  placeSettlement: require("./game/gameState").placeSettlement, //sent when a player clicks on a vertex to place a settlement
  placeCity: require("./game/gameState").placeCity, //sent when a player clicks on a vertex to place a city
  placeRoad: require("./game/gameState").placeRoad, //sent when a player clicks on an edge to place a road
  turnComplete: require("./game/gameState").nextTurn, //sent when the player chooses to end their turn
  rollDice: require("./game/gameState").rollDice, //sent when a player rolls the dice
  requestRoadPrompt: require("./game/gameState").promptRoadPlacement, //sent when a player selects the road building action button, in order to send them valid road placement spots
  requestSettlementPrompt: require("./game/gameState").promptSettlementPlacement, //sent when a player selects the settlement building action button, to send valid settlement placements
  requestCityPrompt: require("./game/gameState").promptCityPlacement,
  purchaseDevCard: require("./game/gameState").purchaseDevCard, //sent when a player chooses to purchase a development card
  discardResources: require("./game/gameState").discardResources,
  placeRobber: require("./game/gameState").placeRobber,
  playDevCard: require("./game/gameState").playDevCard,
  monopoly: require("./game/gameState").monopoly,
  yearOfPlenty: require("./game/gameState").yearOfPlenty,
  proposeTrade: require("./game/gameState").proposeTrade,
  acceptTrade: require("./game/gameState").acceptTrade,
  declineTrade: require("./game/gameState").declineTrade,
  cancelTrade: require("./game/gameState").cancelTrade,
  bankTrade: require("./game/gameState").bankTrade,
  steal: require("./game/gameState").steal,
};
