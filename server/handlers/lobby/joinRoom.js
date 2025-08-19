//This file handles the joining of game rooms, whether using a PIN or through matchmaking

const { rooms, users, playerToRoom } = require("../../store");
const { broadcastToRoom } = require("../../utils/broadcast");

function joinRoomByPIN(data, uuid) {
  //first we get the data from the request (room PIN, room)
  const pin = data.pin;
  const isValidPIN = /^\d{4}$/.test(pin);
  if (!isValidPIN) return { success: false, error: "ERROR: Invalid PIN" };
  const room = rooms[pin];

  //confirm that the player can join the room
  if (!room) return { success: false, error: "ERROR: Room does not exist" };
  if (rooms[pin].currentCapacity === 4) return { success: false, error: "ERROR: Room is full" };

  //add player to room
  room.players.push(uuid);
  room.currentCapacity++;
  playerToRoom[uuid] = pin;
  console.log(`Player ${users[uuid]?.username} joined room #${pin}`);

  //broadcast the updated player list to the room
  const players = room.players.map((id) => ({
    id,
    username: users[id]?.username || "Unknown",
    ready: users[id]?.ready || false,
  }));

  const message = { type: "playerListUpdate", players };
  broadcastToRoom(pin, message);

  return { success: true, pin, players };
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
    currentCapacity: 1,
  };
  playerToRoom[uuid] = pin;
  const players = rooms[pin].players.map((id) => ({
    id,
    username: users[id]?.username || "Unknown",
    ready: users[id]?.ready || false,
  }));
  message = { type: "playerListUpdate", players };

  broadcastToRoom(pin, message);

  console.log(`Room ${pin} created by ${users[uuid]?.username}`);

  return { success: true, pin, players, host: uuid };
}

function createDummyRoom(data, uuid) {
  //DELETE THIS LATER!
  var pin;
  do {
    pin = Math.floor(1000 + Math.random() * 9000);
  } while (rooms[pin]);

  rooms[pin] = {
    players: [uuid],
    currentCapacity: 1,
  };
  playerToRoom[uuid] = pin;

  const dummyUUID1 = "dummy-1";
  const dummyUUID2 = "dummy-2";

  users[dummyUUID1] = { username: "CPU 1", state: {}, ready: true };
  users[dummyUUID2] = { username: "CPU 2", state: {}, ready: true };

  rooms[pin].players.push(dummyUUID1, dummyUUID2);
  rooms[pin].currentCapacity += 2;

  return { success: true, pin, players: rooms[pin].players.map((id) => users[id]?.username || "Unknown") };
}

module.exports = { joinRoomByPIN, createRoom, createDummyRoom };
