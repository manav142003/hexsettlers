const { rooms, users, playerToRoom } = require("./store");
const { broadcastToRoom, broadcastToPlayer } = require("./broadcast");

const adjacentVertices = {
  //adjacency matrix for the vertices
  0: [1, 5, 9],
  1: [0, 2, 8],
  2: [1, 3, 14],
  3: [2, 4, 17],
  4: [3, 5],
  5: [0, 4],
  6: [7, 9, 13],
  7: [6, 8, 12],
  8: [1, 7, 18],
  9: [0, 6],
  10: [11, 13],
  11: [10, 12, 22],
  12: [7, 11, 20],
  13: [6, 10],
  14: [2, 15, 19],
  15: [14, 16, 25],
  16: [15, 17, 28],
  17: [3, 16],
  18: [8, 19, 21],
  19: [14, 18, 29],
  20: [12, 21, 24],
  21: [18, 20, 31],
  22: [11, 23],
  23: [22, 24, 35],
  24: [20, 23, 33],
  25: [15, 26, 30],
  26: [25, 27, 40],
  27: [26, 28],
  28: [16, 27],
  29: [19, 30, 32],
  30: [25, 29, 38],
  31: [21, 32, 34],
  32: [29, 31, 41],
  33: [24, 34, 37],
  34: [31, 33, 43],
  35: [23, 36],
  36: [35, 37],
  37: [33, 36, 45],
  38: [30, 39, 42],
  39: [38, 40, 49],
  40: [26, 39],
  41: [32, 42, 44],
  42: [38, 41, 47],
  43: [34, 44, 46],
  44: [41, 43, 50],
  45: [37, 46],
  46: [43, 45, 52],
  47: [42, 48, 51],
  48: [47, 49],
  49: [39, 48],
  50: [44, 51, 53],
  51: [47, 50],
  52: [46, 53],
  53: [50, 52],
};

const roadSpots = [
  //all "from-to" road spots
  [0, 1],
  [0, 5],
  [0, 9],
  [1, 2],
  [1, 8],
  [2, 3],
  [2, 14],
  [3, 4],
  [3, 17],
  [4, 5],
  [6, 7],
  [6, 9],
  [6, 13],
  [7, 8],
  [7, 12],
  [8, 18],
  [10, 11],
  [10, 13],
  [11, 12],
  [11, 22],
  [12, 20],
  [14, 15],
  [14, 19],
  [15, 16],
  [15, 25],
  [16, 17],
  [16, 28],
  [18, 19],
  [18, 21],
  [19, 29],
  [20, 21],
  [20, 24],
  [21, 31],
  [22, 23],
  [23, 24],
  [23, 35],
  [24, 33],
  [25, 26],
  [25, 30],
  [26, 27],
  [26, 40],
  [27, 28],
  [29, 30],
  [29, 32],
  [30, 38],
  [31, 32],
  [31, 34],
  [32, 41],
  [33, 34],
  [33, 37],
  [34, 43],
  [35, 36],
  [36, 37],
  [37, 45],
  [38, 39],
  [38, 42],
  [39, 40],
  [39, 49],
  [41, 42],
  [41, 44],
  [42, 47],
  [43, 44],
  [43, 46],
  [44, 50],
  [45, 46],
  [46, 52],
  [47, 48],
  [47, 51],
  [48, 49],
  [50, 51],
  [50, 53],
  [52, 53],
];

const vertexToTiles = {
  //map each vertex to the tiles that it is a part of
  0: [0, 1],
  1: [0, 1, 4],
  2: [0, 3, 4],
  3: [0, 3],
  4: [0],
  5: [0],
  6: [1, 2],
  7: [1, 2, 5],
  8: [1, 4, 5],
  9: [1],
  10: [2],
  11: [2, 6],
  12: [2, 5, 6],
  13: [2],
  14: [3, 4, 8],
  15: [3, 7, 8],
  16: [3, 7],
  17: [3],
  18: [4, 5, 9],
  19: [4, 8, 9],
  20: [5, 6, 10],
  21: [5, 9, 10],
  22: [6],
  23: [6, 11],
  24: [6, 10, 11],
  25: [7, 8, 12],
  26: [7, 12],
  27: [7],
  28: [7],
  29: [8, 9, 13],
  30: [8, 12, 13],
  31: [9, 10, 14],
  32: [9, 13, 14],
  33: [10, 11, 15],
  34: [10, 14, 15],
  35: [11],
  36: [11],
  37: [11, 15],
  38: [12, 13, 16],
  39: [12, 16],
  40: [12],
  41: [13, 14, 17],
  42: [13, 16, 17],
  43: [14, 15, 18],
  44: [14, 17, 18],
  45: [15],
  46: [15, 18],
  47: [16, 17],
  48: [16],
  49: [16],
  50: [17, 18],
  51: [17],
  52: [18],
  53: [18],
};

const tileToVertices = {
  //map each tile to its vertices
  0: [0, 1, 2, 3, 4, 5],
  1: [0, 1, 6, 7, 8, 9],
  2: [6, 7, 10, 11, 12, 13],
  3: [2, 3, 14, 15, 16, 17],
  4: [1, 2, 8, 14, 18, 19],
  5: [7, 8, 12, 18, 20, 21],
  6: [11, 12, 20, 22, 23, 24],
  7: [15, 16, 25, 26, 27, 28],
  8: [14, 15, 19, 25, 29, 30],
  9: [18, 19, 21, 29, 31, 32],
  10: [20, 21, 24, 31, 33, 34],
  11: [23, 24, 33, 35, 36, 37],
  12: [25, 26, 30, 38, 39, 40],
  13: [29, 30, 32, 38, 41, 42],
  14: [31, 32, 34, 41, 43, 44],
  15: [33, 34, 37, 43, 45, 46],
  16: [38, 39, 42, 47, 48, 49],
  17: [41, 42, 44, 47, 50, 51],
  18: [43, 44, 46, 50, 52, 53],
};

function createGameState(room) {
  const turnOrder = shuffle([...room.players]);
  return {
    gameStarted: false, //indicates whether or not the game has started
    turn: 0, //specifies whose turn it currently is (each player has an id of 0, 1, 2, or 3)
    turnOrder, //order in which players take turns (randomized)
    placementStep: 0, //helps track whose turn it is to place their initial settlements
    takenVertices: [], //all vertices/settlement spots that have been claimed
    takenEdges: [], //all road edges that have been claimed
    board: generateBoard(), //this is the gameboard (hex tiles, docks, etc.) all set up and randomized
    phase: "setup", //phase of the game (setup, playing, end)
    action: "settlement", //current action that the player is taking
    devCards: generateDevCards(), //holds the deck of all dev cards available for purchase
    bank: { wood: 19, brick: 19, wheat: 19, sheep: 19, ore: 19 }, //bank that players can trade resources in
    robber: { discardCount: 0 }, //tracks which player(s) still need to discard in robber phase
    longestRoad: null, //holds the player with the longest road
    largestArmy: null, //holds the player with the largest army

    players: Object.fromEntries(
      turnOrder.map((id) => [
        id,
        {
          username: users[id]?.username, //player's name
          resources: { wood: 0, brick: 0, wheat: 0, sheep: 0, ore: 0 }, //player's resources
          devCards: [], //player's development cards
          unplayedDevCards: 0,
          roads: [], //player's roads
          settlements: [], //player's settlements
          cities: [], //player's cities
          victoryPoints: 0, //player's victory points
          longestRoadCount: 0, //the size of the player's longest road
          armyCount: 0, //the size of the player's largest army
          statDifferences: { wood: 0, brick: 0, wheat: 0, ore: 0, sheep: 0, victoryPoints: 0, devCardCount: 0, armyCount: 0, longestRoadCount: 0, resourceCount: 0 },
        },
      ])
    ),
  };
}

function initializeGame(data, uuid) {
  //this method is called when receiving a 'startGame' message from the server. Get the room and game state, then broadcast to room to move to game screen
  const { pin, room } = getContext(uuid);
  room.gameState = createGameState(room);
  broadcastToRoom(pin, { type: "initializeGame" });
}

function getGameState(data, uuid) {
  //this method is called once the game is initialized, to get the game state onto the client side.
  const { gameState } = getContext(uuid);

  broadcastGameState(gameState);

  //after the game state is sent for the first time, we also must prompt player 1 to place their first settlement.
  if (!gameState.gameStarted) {
    gameState.gameStarted = true;
    setTimeout(() => {
      promptSettlementPlacement(gameState, gameState.turnOrder[0]);
    });
  }
}

function broadcastGameState(gameState) {
  //broadcast a clean game state to each player
  for (const playerId of gameState.turnOrder) {
    const clientGameState = getClientGameState(gameState, playerId);
    broadcastToPlayer(playerId, { type: "getGameState", gameState: clientGameState });
  }
}

function getClientGameState(gameState, uuid) {
  //some information such as opponent resources and dev cards should be hidden from players, so we must filter the game state before sending it
  const publicPlayers = {};
  for (const [id, player] of Object.entries(gameState.players)) {
    publicPlayers[id] = {
      username: player.username,
      roads: player.roads,
      settlements: player.settlements,
      cities: player.cities,
      victoryPoints: player.victoryPoints,
      longestRoadCount: player.longestRoadCount,
      armyCount: player.armyCount,
      devCardCount: player.unplayedDevCards,
      ...(id === uuid
        ? {
            resources: player.resources,
            devCards: player.devCards,
          }
        : {
            resourceCount: Object.values(player.resources).reduce((a, b) => a + b, 0),
          }),
    };
  }

  const { players: _, ...clientState } = gameState;
  return { ...clientState, players: publicPlayers };
}

function generateBoard() {
  //add all 19 resources to the array based on how many of each there are
  let resources = [];
  const tileCounts = { wood: 4, wheat: 4, sheep: 4, ore: 3, brick: 3, desert: 1 };
  Object.entries(tileCounts).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      resources.push(type);
    }
  });
  resources = shuffle(resources);

  //these tile numbers represent the frequency of the dice roll. "Tiles" will hold the full tile objects.
  const TILE_NUMBERS = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

  //these are the outer and inner tile IDs, not including the very middle one which is the last that will be placed
  const outerTiles = [0, 1, 2, 6, 11, 15, 18, 17, 16, 12, 7, 3];
  const innerTiles = [4, 5, 10, 14, 13, 8];

  //map each outer starting index to each inner starting index
  const outerToInnerMap = {
    0: 0,
    1: 0,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 3,
    7: 3,
    8: 4,
    9: 4,
    10: 5,
    11: 5,
  };

  //first we choose a starting index from the outermost tiles, then rotate the arrays based on that starting position
  const outerStartIndex = Math.floor(Math.random() * outerTiles.length);
  const rotatedOuterTiles = outerTiles.slice(outerStartIndex).concat(outerTiles.slice(0, outerStartIndex));
  const innerStartIndex = outerToInnerMap[outerStartIndex] || 0;
  const rotatedInnerTiles = innerTiles.slice(innerStartIndex).concat(innerTiles.slice(0, innerStartIndex));

  //flatten the arrays into one orderedTileIds array
  const orderedTileIds = [...rotatedOuterTiles, ...rotatedInnerTiles, 9];

  //this helper function gets the next tile number, skipping the desert
  let index = 0;
  const nextNumber = (type) => {
    if (type === "desert") return 7;
    const n = TILE_NUMBERS[index];
    index++;
    return n;
  };

  const tiles = [];
  for (let i = 0; i < orderedTileIds.length; i++) {
    const id = orderedTileIds[i];
    const type = resources[i];
    const number = nextNumber(type);
    tiles.push({ id, type, number, hasRobber: type === "desert", vertices: tileToVertices[id] });
  }

  tiles.sort((a, b) => a.id - b.id);

  //generate the 9 ports and the vertices they are attached to
  const ports = [
    { type: "threeForOne", vertex: 4, angle: 90, pairId: "A", offset: 0.7 },
    { type: "threeForOne", vertex: 5, angle: 30, pairId: "A", offset: 0.7 },
    { type: "twoForOne", resource: "wheat", vertex: 6, angle: 90, pairId: "B", offset: 0.6 },
    { type: "twoForOne", resource: "wheat", vertex: 9, angle: 150, pairId: "B", offset: 0.6 },
    { type: "twoForOne", resource: "ore", vertex: 11, angle: 150, pairId: "C", offset: 0.6 },
    { type: "twoForOne", resource: "ore", vertex: 22, angle: 90, pairId: "C", offset: 0.6 },
    { type: "threeForOne", vertex: 35, angle: 30, pairId: "D", offset: 0.4 },
    { type: "threeForOne", vertex: 36, angle: 150, pairId: "D", offset: 0.4 },
    { type: "twoForOne", resource: "sheep", vertex: 45, angle: 90, pairId: "E", offset: 0.3 },
    { type: "twoForOne", resource: "sheep", vertex: 46, angle: 30, pairId: "E", offset: 0.3 },
    { type: "threeForOne", vertex: 48, angle: 150, pairId: "F", offset: 0.3 },
    { type: "threeForOne", vertex: 49, angle: 90, pairId: "F", offset: 0.3 },
    { type: "threeForOne", vertex: 50, angle: 90, pairId: "G", offset: 0.3 },
    { type: "threeForOne", vertex: 51, angle: 30, pairId: "G", offset: 0.3 },
    { type: "twoForOne", resource: "brick", vertex: 26, angle: 150, pairId: "H", offset: 0.7 },
    { type: "twoForOne", resource: "brick", vertex: 40, angle: 30, pairId: "H", offset: 0.7 },
    { type: "twoForOne", resource: "wood", vertex: 16, angle: 30, pairId: "I", offset: 0.7 },
    { type: "twoForOne", resource: "wood", vertex: 17, angle: 150, pairId: "I", offset: 0.7 },
  ];

  return { tiles, ports };
}

function generateDevCards() {
  //generate a deck of 25 development cards
  const deck = [];
  for (let i = 0; i < 14; i++) deck.push("Knight");
  for (let i = 0; i < 5; i++) deck.push("Victory Point");
  for (let i = 0; i < 2; i++) deck.push("Road Building");
  for (let i = 0; i < 2; i++) deck.push("Monopoly");
  for (let i = 0; i < 2; i++) deck.push("Year of Plenty");
  return deck;
}

function rollDice(data, uuid) {
  //called at the beginning of a player's turn when they roll the dice
  const { pin, gameState, player } = getContext(uuid);
  if (gameState.action !== "roll") return;
  if (gameState.turnOrder[gameState.turn] !== uuid) return;

  //roll both dice and add them up
  let dice1 = Math.floor(Math.random() * 6) + 1;
  let dice2 = Math.floor(Math.random() * 6) + 1;
  let value = dice1 + dice2;

  broadcastToPlayer(uuid, { type: "diceResult", dice1, dice2 });
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} rolled a${value === 8 || value === 11 ? "n" : ""} ${value}`, uuid });

  //if a 7 is rolled, we must handle the discarding and moving of the robber
  if (value === 7) {
    handleSeven(uuid);
  } else {
    //deal players resources if necessary, then send the update back to client
    dealResources(value, gameState);
    gameState.action = "selectAction";
    nextAction(uuid);
  }
}

function handleSeven(uuid) {
  //handles when a 7 is rolled. Identifies and prompts players who need to discard
  const { gameState } = getContext(uuid);
  gameState.action = "robber";
  gameState.robber = {
    mover: uuid,
    discardsPending: [],
  };
  broadcastGameState(gameState);

  //for each player, check how many resources they have. If they have more than 7, they must discard half of them (rounded down)
  for (const [playerId, player] of Object.entries(gameState.players)) {
    const totalResources = Object.values(player.resources).reduce((sum, val) => sum + val, 0);
    if (totalResources > 7) {
      const discardCount = Math.floor(totalResources / 2);
      gameState.robber.discardsPending.push(playerId);
      broadcastToPlayer(playerId, { type: "discardPrompt", count: discardCount, resources: { ...player.resources } });
    }
  }

  //if nobody needs to discard, then prompt the current player to move the robber
  if (gameState.robber.discardsPending.length === 0) promptRobberPlacement(uuid);
}

function promptRobberPlacement(uuid) {
  const { gameState } = getContext(uuid);
  gameState.action = "robber";
  broadcastGameState(gameState);
  const validRobberPlacements = getValidRobberPlacements(uuid);
  broadcastToPlayer(uuid, { type: "promptMessage", message: "Please move the robber" });
  broadcastToPlayer(uuid, { type: "placeRobberPrompt", validRobberPlacements });
}

function placeRobber(data, uuid) {
  const { pin, gameState, player } = getContext(uuid);
  const chosenTileId = data.tile;

  //update the tiles so that the robber is at the specified spot, then update game state so players can see
  for (const tile of gameState.board.tiles) {
    tile.hasRobber = tile.id === chosenTileId;
  }

  //get the tile object using the id
  const chosenTile = gameState.board.tiles.find((t) => t.id === chosenTileId);
  if (!chosenTile) return;

  //find players to be stolen from
  const victims = [];
  for (const [otherId, otherPlayer] of Object.entries(gameState.players)) {
    if (otherId === uuid) continue;

    //if the player has a settlement/city at this tile AND if they have any resources, they become an eligible victim to be stolen from
    const hasSettlementHere = otherPlayer.settlements.some((vertex) => chosenTile.vertices.includes(vertex));
    const hasCityHere = otherPlayer.cities.some((vertex) => chosenTile.vertices.includes(vertex));
    const hasResources = Object.values(otherPlayer.resources).some((v) => v > 0);
    if ((hasSettlementHere || hasCityHere) && hasResources) {
      const resourceCount = Object.values(otherPlayer.resources).reduce((a, b) => a + b, 0);
      victims.push({ uuid: otherId, username: otherPlayer.username, resourceCount });
    }
  }

  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} moved the robber`, uuid });
  broadcastGameState(gameState);

  //prompt the current player to steal from one of the victims
  if (victims.length > 0) {
    broadcastToPlayer(uuid, { type: "stealPrompt", victims });
  } else {
    //if no players to steal from, end this action and prompt user for next action
    delete gameState.robber;
    nextAction(uuid);
  }
}

function discardResources(data, uuid) {
  //takes in a player's discarded resources and removes them from their hand
  const { pin, gameState, player } = getContext(uuid);
  const discardedResources = data.resources;

  //check if the discard is of valid size
  const totalBefore = Object.values(player.resources).reduce((a, b) => a + b, 0);
  const expected = Math.floor(totalBefore / 2);
  const actual = Object.values(discardedResources).reduce((a, b) => a + b, 0);
  if (actual !== expected) return;

  //ensure that the player indeed owns all the resources they are discarding
  for (const [type, amount] of Object.entries(discardedResources)) {
    if ((player.resources[type] || 0) < amount) return;
  }

  //apply the discard: player loses, bank gains
  const negativeChanges = {};
  for (const [type, amount] of Object.entries(discardedResources)) {
    negativeChanges[type] = -amount;
  }
  applyResourceChanges(gameState.bank, player, negativeChanges);

  //remove player from pending discards
  gameState.robber.discardsPending = gameState.robber.discardsPending.filter((id) => id !== uuid);

  //send the updated game state to the room
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} discarded half of their resources`, uuid });
  broadcastGameState(gameState);

  //if all discards are done, prompt the current player to move the robber
  if (gameState.robber.discardsPending.length === 0) promptRobberPlacement(gameState.robber.mover);
}

function getValidRobberPlacements(uuid) {
  //return all tiles that the robber can be moved to (ie. anywhere except where it already is)
  const { gameState } = getContext(uuid);
  return gameState.board.tiles.filter((tile) => !tile.hasRobber).map((tile) => tile.id);
}

function steal(data, uuid) {
  const { victimId } = data;
  const { gameState, pin, player } = getContext(uuid);

  //get the victim and their resources (if they dont exist or they have no resources, return)
  const { player: victim } = getContext(victimId);
  if (!victim) return;
  const available = Object.entries(victim.resources).filter(([_, amt]) => amt > 0);
  if (!available.length) return;

  //remove the resource from the victim's hand, add it to the stealer's hand
  const [resource] = available[Math.floor(Math.random() * available.length)];
  applyResourceChanges(null, victim, { [resource]: -1 });
  applyResourceChanges(null, player, { [resource]: +1 });

  //update game state and send player what they stole
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} stole a resource from ${victim.username}`, uuid });
  broadcastToPlayer(uuid, { type: "stealResult", resource });

  //delete robber phase, and prompt player for their next action
  delete gameState.robber;
  broadcastGameState(gameState);
  nextAction(uuid);
}

function purchaseDevCard(data, uuid) {
  const { pin, gameState, player } = getContext(uuid);

  //return conditions (no dev cards left, can't afford, not player's turn)
  if (gameState.devCards.length === 0) return;
  if (!canAfford(player, { wheat: 1, ore: 1, sheep: 1 })) return;
  if (uuid !== gameState.turnOrder[gameState.turn]) return;

  //charge the player for the development card, pop it from the deck, and lock it (since they cannot play it the same turn they bought it)
  applyResourceChanges(gameState.bank, player, { wheat: -1, ore: -1, sheep: -1 });
  const index = Math.floor(Math.random() * gameState.devCards.length);
  const [cardType] = gameState.devCards.splice(index, 1);
  const devCard = { type: cardType, locked: true, played: false };

  //victory point cards get played immediately. If the card is something else, add to the player's deck
  if (cardType !== "Victory Point") {
    player.unplayedDevCards = (player.unplayedDevCards || 0) + 1;
    player.devCards.push(devCard);
    player.statDifferences.devCardCount = (player.statDifferences.devCardCount || 0) + 1;
  }

  //let players know that a dev card was purchased, let the current player know the type of dev card they got.
  for (const playerId in gameState.players) {
    if (playerId === uuid) broadcastToPlayer(uuid, { type: "promptMessage", message: `You purchased a ${devCard.type} card`, uuid });
    else broadcastToPlayer(playerId, { type: "logMessage", message: `${player.username} purchased a development card`, uuid });
  }
  nextAction(uuid);
}

function shuffle(array) {
  //shuffle an array using Fisher-Yates style algorithm
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function dealResources(tileNum, gameState) {
  //deal resources to each player (given that the bank has them), returning only those that got new resources
  const chosenTiles = [];

  //first get all the tiles that have the correct number based on the dice roll
  for (const tile of gameState.board.tiles) {
    if (tile.number !== tileNum || tile.hasRobber) continue;
    chosenTiles.push(tile);
  }

  //for each tile...
  for (const tile of chosenTiles) {
    const { type, vertices } = tile;

    //...for each player...
    for (const playerId in gameState.players) {
      const player = gameState.players[playerId];

      //...for each of their settlements...
      for (const settlement of player.settlements) {
        //if their settlements are on one of the tile's vertices, then increase their resource count for that tile's resource
        if (vertices.includes(settlement) && (gameState.bank[type] || 0) >= 1) applyResourceChanges(gameState.bank, player, { [type]: 1 });
      }

      //do the same for cities, but add 2 of the resource instead
      for (const city of player.cities) {
        if (vertices.includes(city) && (gameState.bank[type] || 0) >= 2) {
          applyResourceChanges(gameState.bank, player, { [type]: 2 });
        } else if (vertices.includes(city) && (gameState.bank[type] || 0) >= 1) {
          applyResourceChanges(gameState.bank, player, { [type]: 1 });
        }
      }
    }
  }
}

function playDevCard(data, uuid) {
  const { gameState, player, pin } = getContext(uuid);

  //return checks: if it's not the player's turn, or if a dev card has been played this turn
  if (gameState.turnOrder[gameState.turn] !== uuid) return;

  //get the type of the development card
  const type = data.card.type;

  //find the card in the player's hand, return if they do not have it then mark the card as played
  const card = player.devCards.find((card) => card.type === type && !card.locked && !card.played);
  if (!card) return;

  //mark this card as played, then lock all the other cards since you can only play 1 per turn
  card.played = true;
  for (const devCard of player.devCards) devCard.locked = true;

  //decrement unplayed count if not a VP card
  if (type !== "Victory Point") {
    player.unplayedDevCards = Math.max(0, (player.unplayedDevCards || 0) - 1);
    player.statDifferences.devCardCount = (player.statDifferences.devCardCount || 0) - 1;
  }

  //proceed based on the type of dev card played (victory point cards excluded since they are not 'played')
  switch (type) {
    case "Road Building": //create roadbuilding state then prompt player to place first road
      gameState.roadBuilding = { player: uuid, roadsPlaced: 0, inProgress: true };
      promptRoadPlacement(null, uuid);
      break;
    case "Monopoly": //prompt user to select resource for monopoly
      broadcastToPlayer(uuid, { type: "monopolyPrompt" });
      break;
    case "Year of Plenty": //prompt user to select two resources to acquire
      broadcastToPlayer(uuid, { type: "yearOfPlentyPrompt" });
      break;
    case "Knight": //increment the player's army count, check who has the largest army, then prompt the player to place the robber
      player.statDifferences.army = 1;
      promptRobberPlacement(uuid);
      break;
  }
  return;
}

function monopoly(data, uuid) {
  //call a monopoly development card (every opponent has to give the current player all of a specified resource)
  const { gameState, player, pin } = getContext(uuid);
  if (gameState.turnOrder[gameState.turn] !== uuid) return;

  const { resource } = data;

  let totalStolen = 0;

  //for each opponent, get their amount of the specified resource. If they have any, then set that resource to 0
  for (const [opponentId, opponent] of Object.entries(gameState.players)) {
    if (opponentId === uuid) continue;
    const amount = opponent.resources[resource] || 0;
    if (amount > 0) {
      totalStolen += amount;
      applyResourceChanges(null, opponent, { [resource]: -amount });
    }
  }

  //give all collected resources to current player
  if (totalStolen > 0) applyResourceChanges(null, player, { [resource]: totalStolen });

  //update the game state
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} called monopoly, gained ${totalStolen} ${resource}`, uuid });
  broadcastGameState(gameState);
  nextAction(uuid);
}

function yearOfPlenty(data, uuid) {
  const { gameState, player, pin } = getContext(uuid);
  if (gameState.turnOrder[gameState.turn] !== uuid) return;

  //validate the resources input
  const { resources } = data;
  if (!Array.isArray(resources) || resources.length !== 2) return;

  //for each chosen resource, add it to the player's resource count
  const validResources = ["wood", "brick", "sheep", "wheat", "ore"];
  for (const resource of resources) {
    if (!validResources.includes(resource)) return;
    applyResourceChanges(gameState.bank, player, { [resource]: 1 });
  }

  //format the log message to look nice
  let resourceString = "";
  if (resources[0] === resources[1]) {
    resourceString = `2 ${resources[0]}`;
  } else {
    resourceString = `a${resources[0] === "ore" ? "n ore" : ` ${resources[0]}`} and a${resources[1] === "ore" ? "n ore" : ` ${resources[1]}`}`;
  }

  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} called year of plenty, gained ${resourceString}`, uuid });
  broadcastGameState(gameState);
}

function updateVictoryPoints(uuid) {
  //calculate a single player's victory points
  const { gameState, player } = getContext(uuid);

  const prev = player.victoryPoints || 0;

  let points = 0;

  //1 point per settlement, 2 points per city, 1 point per victory point dev card
  points += player.settlements.length;
  points += player.cities.length * 2;
  points += player.devCards.filter((card) => card.type === "Victory Point").length;

  //2 points for largest army or longest road
  gameState.largestArmy = determineLargestArmy(uuid);
  gameState.longestRoad = determineLongestRoad(uuid);
  if (gameState.longestRoad === uuid) points += 2;
  if (gameState.largestArmy === uuid) points += 2;

  //calculate the difference in victory points
  const difference = points - prev;
  player.statDifferences.victoryPoints = (player.statDifferences.victoryPoints || 0) + difference;

  player.victoryPoints = points;
}

function nextAction(uuid) {
  const { gameState, pin } = getContext(uuid);

  //after each action, check players' longest road/largest army counts/victory points, and determine a winner if necessary
  calculateStats(gameState, pin);

  //update the game state with all this new info
  gameState.action = "selectAction";
  broadcastGameState(gameState);

  //prompt the current player for their next move
  const possibleActions = getPossibleActions(uuid);
  broadcastToPlayer(uuid, { type: "selectAction", possibleActions });
}

function sendStatDifferences(gameState, pin) {
  //calculate each player's differences in stats for the animation
  const differences = {};
  for (const [playerId, player] of Object.entries(gameState.players)) {
    differences[playerId] = { ...player.statDifferences };
  }
  broadcastToRoom(pin, { type: "statDifferences", differences, eventId: Date.now() });

  setTimeout(() => {
    for (const player of Object.values(gameState.players)) {
      player.statDifferences = {
        wood: 0,
        brick: 0,
        wheat: 0,
        ore: 0,
        sheep: 0,
        victoryPoints: 0,
        devCardCount: 0,
        armyCount: 0,
        longestRoadCount: 0,
        resourceCount: 0,
      };
    }
  }, 50);
}

function endGame(winner) {
  //broadcast to the room when the game is over
  const { gameState, pin, player } = getContext(winner);
  broadcastToRoom(pin, { type: "gameOver", winner: player, winnerId: winner });
}

function calculateStats(gameState, pin) {
  for (const [playerId, player] of Object.entries(gameState.players)) {
    //determine longest road for player and get the difference from last turn/move
    const prevLongestRoad = player.longestRoadCount || 0;
    player.longestRoadCount = getLongestRoadLength(playerId);
    const longestRoadDiff = player.longestRoadCount - prevLongestRoad;
    player.statDifferences.longestRoadCount = (player.statDifferences.longestRoadCount || 0) + longestRoadDiff;

    //update army count and victory points, end game if necessary
    player.armyCount = player.devCards.filter((card) => card.type === "Knight" && card.played).length;
    updateVictoryPoints(playerId);
    if (player.victoryPoints >= 10) endGame(playerId);
  }
  sendStatDifferences(gameState, pin);
}

function nextTurn(data, uuid) {
  //prompt the next player to play their turn
  const { pin, gameState, player } = getContext(uuid);

  if (gameState.action === "robber") return;

  //after each turn, we recalculate each player's stats (resource counts, army count, etc.) and send the differences
  calculateStats(gameState, pin);

  //unlock the player's development cards so they can be used next turn
  for (const devCard of player.devCards) devCard.locked = false;

  //get the number of players in this game
  const numPlayers = gameState.turnOrder.length;

  //in the setup phase, turns go in a snake-like order (1-2-3-3-2-1)
  if (gameState.phase === "setup") {
    gameState.placementStep++;

    //if we have completed all placement steps, we can now start the playing phase
    if (gameState.placementStep >= numPlayers * 2) {
      startPlayingPhase(gameState, pin);
    } else {
      //get next player, keeping in mind the snake-order. Update the game state for all players then prompt next player
      const step = gameState.placementStep;
      const nextPlayer = step < numPlayers ? gameState.turnOrder[step] : gameState.turnOrder[2 * numPlayers - 1 - step];
      gameState.turn = step < numPlayers ? step : 2 * numPlayers - 1 - step;
      broadcastGameState(gameState);
      promptSettlementPlacement(null, nextPlayer);
    }
    return;
  }

  //in the playing phase, get the next player in-order, they will be prompted to roll the dice
  gameState.action = "roll";
  gameState.turn = (gameState.turn + 1) % numPlayers;
  broadcastGameState(gameState);
}

function startPlayingPhase(gameState, pin) {
  //first, we deal each player their starting resources (using their last placed settlement)
  for (const uuid of gameState.turnOrder) {
    const player = gameState.players[uuid];
    const secondSettlement = player.settlements[1];

    //get the tiles that the vertex is connected to
    const tileIds = vertexToTiles[secondSettlement];

    //for each of those tiles, deal the player a resource card of that type
    tileIds.forEach((tileId) => {
      const tile = gameState.board.tiles[tileId];
      if (tile.type !== "desert") applyResourceChanges(gameState.bank, player, { [tile.type]: 1 });
    });
  }

  sendStatDifferences(gameState, pin);

  //transition from the setup phase to the playing phase, and get next player's turn
  gameState.phase = "playing";
  gameState.turn = -1;
  nextTurn(null, gameState.turnOrder[0]);
}

function canAfford(player, cost) {
  //check if a player can afford a specified cost
  for (let resource in cost) {
    if (player.resources[resource] < cost[resource]) return false;
  }
  return true;
}

function applyResourceChanges(bank = null, player, changes) {
  for (const resource in changes) {
    const delta = changes[resource];

    //update the player's resources and make sure to keep track of the change
    player.resources[resource] = (player.resources[resource] || 0) + delta;
    player.statDifferences[resource] = (player.statDifferences[resource] || 0) + delta;

    //track the total resource count change
    player.statDifferences.resourceCount = (player.statDifferences.resourceCount || 0) + delta;

    //make sure to do the opposite for the bank
    if (bank) bank[resource] = (bank[resource] || 0) - delta;
  }
}

function determineLargestArmy(uuid) {
  //find the player who has the largest army
  const { pin, gameState } = getContext(uuid);
  let largestArmy = 0;
  let potentialHolder = null;

  for (const [playerId, player] of Object.entries(gameState.players)) {
    //count each 'played' knight card
    const armySize = player.devCards.filter((card) => card.type === "Knight" && card.played).length;
    if (armySize > largestArmy) {
      largestArmy = armySize;
      potentialHolder = player;
    }
  }

  //the largest army must be of size 3 at least to qualify
  if (largestArmy < 3) return null;

  //largest army gets overtaken by another player
  if (gameState.largestArmy && gameState.largestArmy !== potentialHolder) {
    broadcastToRoom(pin, { type: "logMessage", message: `${gameState.largestArmy.username} lost largest army`, uuid });
  }

  //largest army gets acquired by a player (whether overtaken or not)
  if (gameState.largestArmy !== potentialHolder) {
    broadcastToRoom(pin, { type: "logMessage", message: `${potentialHolder.username} gained largest army`, uuid });
    return potentialHolder;
  }

  //current holder remains if they do not get overtaken
  return gameState.largestArmy;
}

function getContext(uuid) {
  //this method finds the room pin, room, gamestate, and player object based on the passed UUID
  const pin = playerToRoom[uuid];
  const room = rooms[pin];
  const gameState = room?.gameState;
  const player = gameState?.players[uuid];
  return { pin, room, gameState, player };
}

function getPossibleActions(uuid) {
  //this method checks if the player has the appropriate facilities for the action buttons to be enabled
  const { player, gameState } = getContext(uuid);
  const actions = {};

  //check if player can place a settlement
  if (player.settlements.length < 5) {
    //first check: they must have less than 5 settlements
    if (getValidSettlementPlacements(gameState, uuid).length > 0) {
      //second check: they must have somewhere to put the settlement
      if (canAfford(player, { wood: 1, brick: 1, wheat: 1, sheep: 1 })) {
        //third check: they must be able to afford the settlement
        actions.placeSettlement = { allowed: true, description: "Place a settlement" };
      } else actions.placeSettlement = { allowed: false, description: "Insufficient resources" };
    } else actions.placeSettlement = { allowed: false, description: "No valid settlement spots" };
  } else actions.placeSettlement = { allowed: false, description: "Max settlements reached (5)" };

  //check if player can place road
  if (player.roads.length < 15) {
    //first check: they must have less than 15 roads
    if (getValidRoadPlacements(gameState, uuid).length > 0) {
      //second check: they must have somewhere to build the road
      if (canAfford(player, { wood: 1, brick: 1 })) {
        //third check: they must be able to afford the road
        actions.placeRoad = { allowed: true, description: "Place a road" };
      } else actions.placeRoad = { allowed: false, description: "Insufficient resources" };
    } else actions.placeRoad = { allowed: false, description: "No valid road spots" };
  } else actions.placeRoad = { allowed: false, description: "Max roads reached (15)" };

  //check if player can place a city
  if (player.cities.length < 4) {
    //first check: they must have fewer than 4 cities already
    if (player.settlements.length > 0) {
      //second check: they must have an upgradable settlement on the board
      if (canAfford(player, { ore: 3, wheat: 2 })) {
        //third check: they must be able to afford the city
        actions.placeCity = { allowed: true, description: "Place a city" };
      } else actions.placeCity = { allowed: false, description: "Insufficient resources" };
    } else actions.placeCity = { allowed: false, description: "No valid city spots" };
  } else actions.placeCity = { allowed: false, description: "Max cities reached (4)" };

  //check if player can afford a development card
  if (gameState.devCards.length > 0) {
    //first check: confirm that there are development cards in the deck
    if (canAfford(player, { wheat: 1, ore: 1, sheep: 1 })) {
      //second check: confirm that they can afford the development card
      actions.buyDevCard = { allowed: true, description: "Purchase a development card" };
    } else actions.buyDevCard = { allowed: false, description: "Insufficient resources" };
  } else actions.buyDevCard = { allowed: false, description: "No development cards remaining in deck" };

  //check if player can trade (as long as the player has at least one resource, they can trade it)
  const hasResources = Object.values(player.resources).some((amount) => amount > 0);
  actions.trade = hasResources ? { allowed: true, description: "Propose a trade" } : { allowed: false, description: "You have no resources to trade" };

  //check if player can exchange with the bank (based on amount of their resources and which ports they're on)
  const bankOptions = getBankTradeOptions(uuid);
  actions.bank = bankOptions.length > 0 ? { allowed: true, options: bankOptions, description: "Exchange with the bank" } : { allowed: false, description: "You have no options to trade" };
  return actions;
}

function getPlayerPorts(uuid) {
  //for each port on the board, check if the player is built there. If so, add to their list of ports, then return list
  const { gameState, player } = getContext(uuid);
  const ports = [];
  for (const port of gameState.board.ports) {
    const isConnected = player.settlements.includes(port.vertex) || player.cities.includes(port.vertex);
    if (isConnected) ports.push(port);
  }
  return ports;
}

function getBankTradeOptions(uuid) {
  const { player } = getContext(uuid);
  const options = [];
  const ports = getPlayerPorts(uuid);

  //determine each resource's trade rate by seeing if they have a generic 3:1 port. If so, rate is 3, if not, rate is 4
  const hasGenericPort = ports.some((port) => port.type === "threeForOne");
  const tradeRates = Object.fromEntries(Object.keys(player.resources).map((res) => [res, hasGenericPort ? 3 : 4]));

  //if the player has a 2:1 port, then that resource has a rate of 2
  for (const port of ports) {
    if (port.type === "twoForOne") tradeRates[port.resource] = 2;
  }

  //for each resource and its rate, if the player can afford to trade that resource, add it to the list of options
  for (const [resource, rate] of Object.entries(tradeRates)) {
    if ((player.resources[resource] || 0) >= rate) options.push({ give: { [resource]: rate } });
  }
  return options;
}

function bankTrade(data, uuid) {
  const { player, gameState, pin } = getContext(uuid);
  const { give, receive } = data;

  //checks: if it's not the player's turn, or they can't afford the give, or the give is not a valid option for them, or the bank has none of that resource left, return
  if (gameState.turnOrder[gameState.turn] !== uuid) return;
  if (!canAfford(player, give)) return;
  const isValidGive = getBankTradeOptions(uuid).some((option) => Object.keys(option.give).length === Object.keys(give).length && Object.entries(option.give).every(([res, amt]) => give[res] === amt));
  if (!isValidGive) return;
  if ((gameState.bank[receive] || 0) < 1) return;

  //decrement "give" resource from the player and give to bank. decrement "receive" resource from the bank and give to player.
  const [giveResource, giveAmount] = Object.entries(give)[0];

  //apply the resource exchange
  applyResourceChanges(gameState.bank, player, { [giveResource]: -giveAmount });
  applyResourceChanges(gameState.bank, player, { [receive]: 1 });

  //update the game state and let player continue their turn
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} traded ${giveAmount} ${giveResource} to the bank for 1 ${receive}`, uuid });
  broadcastGameState(gameState);
  nextAction(uuid);
}

function placeSettlement(data, uuid) {
  //first we must get the gameState for the player's room, then validate if we should indeed be placing a settlement
  const { pin, gameState, player } = getContext(uuid);
  const { location } = data;
  if (gameState.action !== "settlement") return { success: false, error: "cannotPlaceSettlement" };

  //verify that the chosen location is a valid spot to place a settlement
  const validSettlements = getValidSettlementPlacements(gameState, uuid);
  if (!validSettlements.includes(location)) return { success: false, error: "invalidPlacement" };

  //confirm that the player has the appropriate resources for the settlement, and deduct
  if (gameState.phase === "playing") {
    if (!canAfford(player, { wood: 1, brick: 1, wheat: 1, sheep: 1 })) return { success: false, error: "cannotAfford" };
    applyResourceChanges(gameState.bank, player, { wood: -1, brick: -1, wheat: -1, sheep: -1 });
  }

  //update the game state with the newly added settlement
  player.settlements.push(location);
  gameState.takenVertices.push(location);

  //broadcast the settlement placement to the entire room
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} placed a settlement`, uuid });
  broadcastGameState(gameState);

  if (gameState.phase === "setup") {
    //if in the setup phase, we must now prompt the player to place a road at this specific location
    promptRoadPlacement(null, uuid, location);
  } else {
    //if in the playing phase, let the player choose their next action
    nextAction(uuid);
  }

  return { success: true };
}

function getValidSettlementPlacements(gameState, uuid) {
  const validSettlements = [];

  for (let i = 0; i < 54; i++) {
    //verify that there is not a settlement already at this spot
    if (gameState.takenVertices.includes(i)) continue;

    //verify that there are no neighbouring settlements to this one, using the adjacency matrix
    const neighbours = adjacentVertices[i];
    if (neighbours.some((vertex) => gameState.takenVertices.includes(vertex))) continue;

    //verify that the chosen settlement placement is connected to one of their roads
    if (gameState.phase === "playing") {
      const connected = gameState.players[uuid].roads.some(([a, b]) => a === i || b === i);
      if (!connected) continue;
    }
    validSettlements.push(i);
  }

  return validSettlements;
}

function promptSettlementPlacement(data, uuid) {
  //get all valid settlement placements for the current player
  const { gameState, pin } = getContext(uuid);
  if (uuid != gameState.turnOrder[gameState.turn]) return;
  gameState.action = "settlement";
  const validSettlements = getValidSettlementPlacements(gameState, uuid);
  broadcastToPlayer(uuid, { type: "promptMessage", message: "Please place a settlement" });
  broadcastToPlayer(uuid, { type: "settlementPrompt", validSettlements });
  broadcastGameState(gameState);
}

function placeCity(data, uuid) {
  const { pin, gameState, player } = getContext(uuid);
  const { location } = data;

  //check that this placement is valid
  if (gameState.action !== "city") return;
  if (!player.settlements.includes(location)) return;
  if (!canAfford(player, { ore: 3, wheat: 2 })) return;

  //switch to city by removing the player's settlement and adding it to their city list, then charge the player
  applyResourceChanges(gameState.bank, player, { ore: -3, wheat: -2 });
  player.settlements = player.settlements.filter((vertex) => vertex !== location);
  player.cities.push(location);

  //update the game's state and broadcast the changes to the room
  gameState.action = "selectAction";
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} upgraded to a city`, uuid });
  broadcastGameState(gameState);

  //end this action and let player choose their next action
  nextAction(uuid);
}

function promptCityPlacement(data, uuid) {
  const { gameState, player, pin } = getContext(uuid);
  gameState.action = "city";
  const validCities = player.settlements;
  broadcastToPlayer(uuid, { type: "promptMessage", message: "Please place a city" });
  broadcastToPlayer(uuid, { type: "cityPrompt", validCities });
  broadcastGameState(gameState);
}

/*------------------- ROADS ----------------------*/

function placeRoad(data, uuid) {
  //first get all the game state/player/room info and verify the action
  const { pin, gameState, player } = getContext(uuid);
  if (gameState.action !== "road") return;
  if (gameState.turnOrder[gameState.turn] !== uuid) return;

  //get the 'from' and 'to' indices from the request
  const { from, to } = data;
  const roadKey = getRoadKey(from, to);

  //get all the valid road positions for this player and return if their chosen road spot is invalid
  const validRoads = getValidRoadPlacements(gameState, uuid);
  const isValid = validRoads.some(([a, b]) => (a === from && b === to) || (a === to && b === from));
  if (!isValid) return;

  //confirm that the player has the appropriate resources, and charge them (unless in road building where roads are free)
  if (gameState.phase === "playing" && !gameState.roadBuilding?.inProgress) {
    if (!canAfford(player, { wood: 1, brick: 1 })) return { success: false, error: "cannotAfford" };
    applyResourceChanges(gameState.bank, player, { wood: -1, brick: -1 });
  }

  //now add the road to the player's list of roads, and add its key to taken edges set
  player.roads.push([Math.min(from, to), Math.max(from, to)]);
  gameState.takenEdges.push(roadKey);

  //if roadBuilding card is active, check if the player needs to place their second road
  if (gameState.roadBuilding?.inProgress && gameState.roadBuilding.player === uuid) {
    gameState.roadBuilding.roadsPlaced++;

    //prompt road placement again if needed, or delete roadBuilding state
    if (gameState.roadBuilding.roadsPlaced < 2) {
      broadcastToRoom(pin, { type: "logMessage", message: `${player.username} placed a road`, uuid });
      promptRoadPlacement(null, uuid);
      return;
    } else delete gameState.roadBuilding;
  }

  //broadcast road update to the room
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} placed a road`, uuid });
  broadcastGameState(gameState);

  //if in setup phase, proceed to next turn. If in playing phase, send next action options to player
  if (gameState.phase === "setup") {
    nextTurn(null, uuid);
  } else if (gameState.phase === "playing") {
    nextAction(uuid);
  }
}

function getValidRoadPlacements(gameState, uuid, location) {
  const validRoads = [];
  const player = gameState.players[uuid];

  //loop through each possible road placement spot
  for (const [from, to] of roadSpots) {
    //filter out roads that are already taken
    const roadKey = getRoadKey(from, to);
    if (gameState.takenEdges.includes(roadKey)) continue;

    //if a location is specified, then we only want to place roads at this particular house (during setup phase)
    if (location) {
      if (location === from || location === to) validRoads.push([from, to]);
    } else {
      //check if the road spot can be connected to one of the player's existing roads or settlements, and add to the valid list
      const connectedToSettlement = player.settlements.includes(from) || player.settlements.includes(to);
      const connectedToRoad = player.roads.some(([a, b]) => [a, b].includes(from) || [a, b].includes(to));
      if ((connectedToSettlement || connectedToRoad) && !isBlocked(uuid, [from, to])) validRoads.push([from, to]);
    }
  }
  return validRoads;
}

function isBlocked(uuid, proposedRoad) {
  const { player } = getContext(uuid);
  const opponentVertices = getOpponentVertices(uuid);

  //get the vertices of the road we are trying to figure out is blocked or not
  const [from, to] = proposedRoad;

  //if both vertices are blocked (somehow), then this road is definitely blocked
  if (opponentVertices.has(from) && opponentVertices.has(to)) return true;

  //if neither vertices are blocked, then this road is definitely not blocked
  if (!opponentVertices.has(from) && !opponentVertices.has(to)) return false;

  //get the vertex that the opponent is NOT settled at
  const unblockedVertex = opponentVertices.has(from) ? to : from;

  //create a set of all vertices that appear in the player's roads
  const visited = new Set();
  for (const [a, b] of player.roads) {
    visited.add(a);
    visited.add(b);
  }

  //if the set contains the unblocked vertex, then the road is not blocked, since we can reach it from the opposite side of the opponent
  return !visited.has(unblockedVertex);
}

function getRoadKey(from, to) {
  return [Math.min(from, to), Math.max(from, to)].join("-");
}

function getOpponentVertices(uuid) {
  //find all vertices owned by the passed player's opponents
  const { gameState } = getContext(uuid);
  const opponentVertices = new Set();
  for (const [otherUUID, otherPlayer] of Object.entries(gameState.players)) {
    if (otherUUID === uuid) continue;
    for (const vertex of [...otherPlayer.settlements, otherPlayer.cities]) opponentVertices.add(vertex);
  }
  return opponentVertices;
}

function promptRoadPlacement(data, uuid, location) {
  //gets all valid road placements for the player
  const { gameState, pin } = getContext(uuid);
  gameState.action = "road";
  const validRoads = getValidRoadPlacements(gameState, uuid, location);
  broadcastToPlayer(uuid, { type: "promptMessage", message: "Please place a road" });
  broadcastToPlayer(uuid, { type: "roadPrompt", validRoads });
  broadcastGameState(gameState);
}

function determineLongestRoad(uuid) {
  const { gameState, pin } = getContext(uuid);
  let longestRoad = 0;
  let potentialHolder = null;
  let tie = false;

  //first, we find each player's longest road
  for (const [playerId, player] of Object.entries(gameState.players)) {
    const length = getLongestRoadLength(playerId);

    //if the player's length is longer than the current found longest road, set that player to the sole potential holder
    if (length > longestRoad) {
      longestRoad = length;
      potentialHolder = player;
      tie = false;
      //if another player ties with the holder, mark the tie flag as true
    } else if (length === longestRoad && longestRoad >= 5) tie = true;
  }

  //if the longest road is under 5, nobody gets longest road
  if (longestRoad < 5) {
    //if there WAS a previous longest road but not anymore, we must remove them as longest road and return null
    if (gameState.longestRoad) broadcastToRoom(pin, { type: "logMessage", message: `${gameState.longestRoad.username} lost longest road`, uuid });
    return null;
  }

  //if tied, then the current longest road holder remains
  if (tie) return gameState.longestRoad;

  //if we have a new longest road holder, return that player
  if (potentialHolder !== gameState.longestRoad) {
    if (gameState.longestRoad) broadcastToRoom(pin, { type: "logMessage", message: `${gameState.longestRoad.username} lost longest road`, uuid });
    broadcastToRoom(pin, { type: "logMessage", message: `${potentialHolder.username} got longest road`, uuid });
  }
  return potentialHolder;
}

function getLongestRoadLength(uuid) {
  const { player } = getContext(uuid);
  const graph = roadGraph(player.roads);
  let maxLength = 0;
  const opponentVertices = getOpponentVertices(uuid);
  for (const startingVertex of Object.keys(graph)) {
    const visitedRoads = new Set();
    const length = depthFirstSearch(startingVertex, null, graph, visitedRoads, opponentVertices);
    maxLength = Math.max(maxLength, length);
  }

  return maxLength;
}

function roadGraph(roads) {
  //create a road graph: for each 'from, to' pair, add them to each others' graphs if not already added
  const graph = {};
  for (const [a, b] of roads) {
    if (!graph[a]) graph[a] = [];
    if (!graph[b]) graph[b] = [];
    graph[a].push(b);
    graph[b].push(a);
  }
  return graph;
}

function depthFirstSearch(from, prev, graph, visitedRoads, opponentVertices) {
  let max = 0;

  //loop through each neighbouring road
  for (const to of graph[from]) {
    const roadKey = getRoadKey(from, to); //get the key for the road
    if (visitedRoads.has(roadKey)) continue; //if the road has been visited already, continue
    if (opponentVertices.has(to) && to !== prev) continue; //

    //continue depth first search with each 'to' vertex
    visitedRoads.add(roadKey);
    const length = 1 + depthFirstSearch(to, from, graph, visitedRoads, opponentVertices);
    visitedRoads.delete(roadKey);
    max = Math.max(max, length);
  }

  //return the largest road from all possibilities of road traversals
  return max;
}

function proposeTrade(data, uuid) {
  const { gameState, player, pin } = getContext(uuid);
  const { offer, request } = data;

  //track the current trade in the game state (who is offering, what their offer/request is, and whether everyone responded)
  if (gameState.activeTrade) return;
  gameState.activeTrade = { offerer: uuid, offer, request, responses: {} };

  //the user proposes a trade to all of their opponents
  for (const [opponentId, opponent] of Object.entries(gameState.players)) {
    if (uuid === opponentId) continue;
    broadcastToPlayer(opponentId, { type: "tradePrompt", uuid, player, offer, request });
  }
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} proposed a trade`, uuid });
}

function acceptTrade(data, uuid) {
  const { gameState, player: acceptingPlayer, pin } = getContext(uuid);
  const { offerer, accepter, offer, request } = data;
  const { player: offeringPlayer } = getContext(offerer);

  //checks (accepter is the one who made the call, or if either player can't afford their part)
  if (!gameState.activeTrade) return;
  if (gameState.activeTrade.responses[uuid] && gameState.activeTrade.responses[uuid] !== "pending") return;
  if (uuid !== accepter) return;
  if (!canAfford(offeringPlayer, offer)) return;
  if (!canAfford(acceptingPlayer, request)) {
    declineTrade(data, uuid);
    return;
  }

  //offeringPlayer gives "offer" resources and acceptingPlayer gains them
  for (const [resource, amount] of Object.entries(offer)) {
    applyResourceChanges(null, offeringPlayer, { [resource]: -amount }, null);
    applyResourceChanges(null, acceptingPlayer, { [resource]: +amount }, null);
  }

  //acceptingPlayer gives "request" resources and offeringPlayer gains them
  for (const [resource, amount] of Object.entries(request)) {
    applyResourceChanges(null, acceptingPlayer, { [resource]: -amount }, null);
    applyResourceChanges(null, offeringPlayer, { [resource]: +amount }, null);
  }

  //update the changes to the room
  delete gameState.activeTrade;
  broadcastToRoom(pin, { type: "logMessage", message: `${acceptingPlayer.username} accepted a trade from ${offeringPlayer.username}`, uuid });
  broadcastGameState(gameState);

  //end the trade then prompt the offering player to select their next action
  broadcastToRoom(pin, { type: "tradeComplete" });
  nextAction(offerer);
}

function declineTrade(data, uuid) {
  const { gameState, pin } = getContext(uuid);

  //checks (if there's no currently active trade or if this player already responded)
  if (!gameState.activeTrade) return;
  const trade = gameState.activeTrade;
  if (trade.responses[uuid]) return;

  //mark this player as 'declined'
  trade.responses[uuid] = "declined";

  //check if there are any players who have yet to respond to the trade
  const numResponders = gameState.turnOrder.length - 1;
  const numResponses = Object.keys(trade.responses).length;
  if (numResponses === numResponders) {
    //if everyone responded, delete the active trade and broadcast the update to the room
    delete gameState.activeTrade;
    broadcastToRoom(pin, { type: "logMessage", message: `All players declined ${gameState.players[trade.offerer]?.username}'s trade`, uuid });
    broadcastToRoom(pin, { type: "tradeComplete" });
    nextAction(trade.offerer);
  } else {
    //if a player responds, let the offering player know that they declined
    broadcastToPlayer(trade.offerer, { type: "tradeDeclined", numResponses, numResponders });
  }
}

function cancelTrade(data, uuid) {
  const { gameState, player, pin } = getContext(uuid);

  //only the offerer can cancel the trade if there is an active one
  const trade = gameState.activeTrade;
  if (!trade || trade.offerer !== uuid) return;

  //delete the active trade and broadcast to the room
  delete gameState.activeTrade;
  broadcastToRoom(pin, { type: "logMessage", message: `${player.username} cancelled their trade`, uuid });
  broadcastToRoom(pin, { type: "tradeComplete" });

  //allow player to choose next action
  nextAction(uuid);
}

module.exports = {
  initializeGame,
  getGameState,
  nextTurn,
  rollDice,
  purchaseDevCard,
  discardResources,
  placeRobber,
  placeSettlement,
  placeRoad,
  placeCity,
  promptRoadPlacement,
  promptSettlementPlacement,
  promptCityPlacement,
  playDevCard,
  monopoly,
  yearOfPlenty,
  proposeTrade,
  acceptTrade,
  declineTrade,
  cancelTrade,
  bankTrade,
  steal,
};
