//This file handles the joining of game rooms, whether using a PIN or through matchmaking

const { rooms, users, playerToRoom } = require("./store");
const { broadcastToRoom, updatePlayerList } = require("./broadcast");

function joinRoom(data, uuid) {
  //first we get the data from the request (room PIN, room)
  const pin = data.pin;
  const isValidPIN = /^\d{4}$/.test(pin);
  if (!isValidPIN) return { success: false, error: "ERROR: Invalid PIN" };
  const room = rooms[pin];

  //confirm that the player can join the room
  if (!room) return { success: false, error: "ERROR: Room does not exist" };
  if (room.players.length >= 4) return { success: false, error: "ERROR: Room is full" };

  //add player to room
  room.players.push(uuid);
  playerToRoom[uuid] = pin;
  users[uuid].ready = false;
  console.log(`Player ${users[uuid]?.username} joined room #${pin}`);

  updatePlayerList(data, uuid);

  return { success: true, pin };
}

function createRoom(data, uuid) {
  //generate a unique room PIN
  var pin;
  do {
    pin = Math.floor(1000 + Math.random() * 9000);
  } while (rooms[pin]);

  //create the room using the PIN
  rooms[pin] = {
    players: [uuid],
    host: uuid,
  };

  playerToRoom[uuid] = pin;

  console.log(`Room ${pin} created by ${users[uuid]?.username}`);
  return { success: true, pin };
}

function leaveRoom(data, uuid) {
  //get pin
  const pin = playerToRoom[uuid];
  if (!pin) return { success: false, error: "Player is not in a room" };

  //check if the room exists
  const room = rooms[pin];
  if (!room) {
    delete playerToRoom[uuid];
    return { success: false, error: "Room does not exist" };
  }

  //remove the player from the room
  room.players = room.players.filter((id) => id !== uuid);
  delete playerToRoom[uuid];

  console.log(`Player ${users[uuid]?.username} left room #${pin}`);

  //notify the rest of the room that the player left the game
  if (room.gameState) {
    delete room.gameState;
    room.players.forEach((id) => {
      if (users[id]) users[id].ready = false;
    });
    broadcastToRoom(pin, { type: "gameAborted", username: users[uuid]?.username });
  }

  //reassign host or delete room
  if (room.host === uuid) {
    if (room.players.length > 0) {
      room.host = room.players[0];
      console.log(`New host for room #${pin} is ${users[room.host]?.username}`);
    } else {
      delete rooms[pin];
      console.log(`Room #${pin} deleted, all players left`);
      return { success: true, message: "Room deleted" };
    }
  }

  //if still in lobby, notify remaining players
  if (!room.gameState) {
    broadcastToRoom(pin, { type: "playerLeft", uuid, username: users[uuid]?.username });
    updatePlayerList({ pin }, uuid);
  }

  return { success: true };
}

function readyUp(data, uuid) {
  //first obtain the user, their room PIN, and the actual room
  const user = users[uuid];
  if (!user) return;
  const pin = playerToRoom[uuid];
  const room = rooms[pin];

  user.ready = data.ready; //change the user's ready state

  //broadcast the update to all players in the room
  const players = room.players.map((id) => ({
    id,
    username: users[id]?.username || "Unknown",
    ready: users[id]?.ready,
    isHost: id === room.host,
  }));
  broadcastToRoom(pin, { type: "playerListUpdate", players });

  console.log(`${user.username} is ${user.ready ? "ready" : "not ready"}!`);
}

function endGame(data, uuid) {
  const pin = playerToRoom[uuid];
  if (!pin) return { success: false, error: "Player is not in a room" };

  const room = rooms[pin];
  if (!room) return { success: false, error: "Room does not exist" };

  if (!room.gameState) {
    return { success: false, error: "No game in progress" };
  }

  //delete the game state
  delete room.gameState;

  //reset everyone's ready state
  room.players.forEach((id) => {
    if (users[id]) {
      users[id].ready = false;
    }
  });

  //send return to lobby message to front end to kick players back to the lobby
  broadcastToRoom(pin, { type: "returnToLobby" });

  console.log(`Game in room #${pin} ended`);

  return { success: true };
}

module.exports = { joinRoom, createRoom, leaveRoom, readyUp, endGame };
