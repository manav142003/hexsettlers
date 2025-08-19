const { rooms, connections } = require("../store");

function broadcastToRoom(pin, message) {
  //get the room by the PIN then broadcast message to all players in the room
  const room = rooms[pin];
  if (!room || !room.players) return;
  const str = JSON.stringify(message);
  room.players.forEach((uuid) => {
    const conn = connections[uuid];
    if (conn && conn.readyState === conn.OPEN) conn.send(str);
  });
}

function broadcastToPlayer(uuid, message) {
  const conn = connections[uuid];
  const str = JSON.stringify(message);
  if (conn && conn.readyState === conn.OPEN) conn.send(str);
}

module.exports = { broadcastToRoom, broadcastToPlayer };
