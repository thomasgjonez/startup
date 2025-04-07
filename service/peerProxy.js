const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    socket.roomCode = null;

    console.log('New WebSocket connection established');

    // Handle incoming messages
    socket.on('message', function message(data) {
      console.log('Message received:', data.toString());

      try {
        const parsed = JSON.parse(data);

        // Handle joining a room
        if (parsed.type === 'join') {
          socket.roomCode = parsed.roomCode;
          console.log(`Client joined room: ${parsed.roomCode}`);
          return;
        }

        if (!socket.roomCode) {
          console.warn('Message received before room join. Ignoring.');
          return;
        }

        // Broadcast to same-room clients (excluding sender)
        console.log(` Broadcasting to room: ${socket.roomCode}`);
        socketServer.clients.forEach((client) => {
          if (
            client !== socket &&
            client.readyState === WebSocket.OPEN &&
            client.roomCode === socket.roomCode
          ) {
            console.log('Sending message to a client in room:', socket.roomCode);
            client.send(JSON.stringify(parsed));
          }
        });
      } catch (err) {
        console.error(' Invalid WebSocket message format:', err);
      }
    });

    // Connection closed
    socket.on('close', (code, reason) => {
      console.log(` Socket closed. Code: ${code}, Reason: ${reason}`);
    });

    // Handle low-level socket errors
    socket.on('error', (err) => {
      console.error(' WebSocket error on socket:', err);
    });

    // Respond to ping/pong to keep connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
      console.log('Pong received from client');
    });
  });

  // Periodic ping to check if clients are still connected
  setInterval(() => {
    socketServer.clients.forEach((client) => {
      if (client.isAlive === false) {
        console.warn('Terminating unresponsive socket');
        return client.terminate();
      }

      console.log('Pinging client to check if alive');
      client.isAlive = false;
      client.ping();
    });
  }, 10000);

  socketServer.on('error', (err) => {
    console.error(' WebSocket Server error:', err);
  });
}

module.exports = { peerProxy };
