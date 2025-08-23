const http = require("http"); //creates a basic HTTP server
const { WebSocketServer } = require("ws"); //websocket library
const url = require("url"); //used to parse URL and extract query parameters
const uuidv4 = require("uuid").v4; //used to create unique IDs for connected clients
const { leaveRoom } = require("./lobby");

//create base HTTP server with WebSocket server layered on top
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

//connections stores active WebSocket connections by UUID, users stores user metadata by UUID
const { connections, users, playerToRoom, rooms } = require("./store");
const messageHandlers = {
  ...require("./lobby"),
  ...require("./broadcast"),
  ...require("./gameState"),
};

wsServer.on("connection", (connection, request) => {
  //get the username from the query string and generate a UUID for this client
  const { username } = url.parse(request.url, true).query;

  if (!username || username.length > 8) {
    connection.send(
      JSON.stringify({
        type: "error",
        message: "ERROR: Username must be a maximum of 8 characters",
      })
    );
    connection.close();
    return;
  }

  const uuid = uuidv4();

  //register the player
  connections[uuid] = connection;
  users[uuid] = { username };
  console.log(`${username} joined!`);
  connection.send(JSON.stringify({ type: "welcome", uuid }));

  //message handler; fires whenever we receive a message from the user
  connection.on("message", (message) => {
    try {
      //first we get the data and the proper data handler
      const data = JSON.parse(message);
      const handler = messageHandlers[data.type];

      //if there's no handler, return an error to the client
      if (!handler) return connection.send(JSON.stringify({ type: "error", message: `ERROR: Unknown message type: ${data.type}` }));

      //otherwise, handle the message and return the result to the server
      const result = handler(data, uuid);
      if (result && result.sendBack != false) connection.send(JSON.stringify({ type: `${data.type}Result`, ...result }));
    } catch (err) {
      connection.send(JSON.stringify({ type: "error", message: "ERROR: Failed to process message", detail: err.message }));
    }
  });

  //disconnect handler; removes player from room and server
  connection.on("close", () => {
    console.log(`${users[uuid]?.username || "Unknown User"} disconnected from the server`);
    const pin = playerToRoom[uuid];
    if (!pin) return;

    leaveRoom(null, uuid);

    delete playerToRoom[uuid];
    delete users[uuid];
    delete connections[uuid];
  });
});

//start the server on the specified port
server.listen(port, () => {
  console.log(`Hex Settlers server is running on port ${port}.`);
});
