const { rooms, users, playerToRoom } = require("../../store");
const { broadcastToRoom } = require("../../utils/broadcast");

function handleReady(data, uuid) {
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
  }));
  broadcastToRoom(pin, { type: "playerListUpdate", players });

  console.log(`${user.username} is ${user.ready ? "ready" : "not ready"}!`);
}

module.exports = { handleReady };
