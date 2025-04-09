const GameEvent = {
    System: 'system',
    GameStart: 'gameStart',
    GameEnd: 'gameEnd',
    GameUpdate: 'gameUpdate',
    Chat: 'chat',
  };
  
  class EventMessage {
    constructor(from, type, value) {
      this.from = from;
      this.type = type;
      this.value = value;
    }
  }
  
  class GameEventNotifier {
    constructor() {
      this.socket = null;
      this.handlers = [];
      this.roomCode = null;
    }
  
    connect() {
        if (this.socket) {
            if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
              console.log("Closing previous WebSocket connection before opening a new one.");
              this.socket.close();
            }
          }
  
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const host = window.location.hostname;
      let port = window.location.port;
      console.log(`Connecting to: ${protocol}://${host}:${port}`);
      this.socket = new WebSocket(`${protocol}://${host}:${port}/ws`);
    //   const backendPort = 4000;// this is temp and hardcoded
    //   this.socket = new WebSocket(`${protocol}://${host}:${backendPort}`);
  
      this.socket.onopen = () => {
        console.log("WS Connected");
        if (this.roomCode) {
          this.send({
            type: 'join',
            roomCode: this.roomCode,
            username: this.username,
          });
        }
      };
  
      this.socket.onclose = () => {
        console.log("WS Disconnected");
      };
  
      this.socket.onerror = (error) => {
        console.error("WS Error:", error);
      };
  
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(await msg.data.text?.() ?? msg.data);
          this.receiveEvent(event);
        } catch (err) {
          console.error("WS Failed to parse message:", err);
        }
      };
    }
  
    joinRoom(roomCode, username) {
      this.roomCode = roomCode;
      this.username = username;
      this.connect();
  
      if (this.socket.readyState === WebSocket.OPEN) {
        this.send({
          type: 'join',
          roomCode: this.roomCode,
          username: this.username,

        });
      }
    }
  
    send(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn("WS Tried to send before connection was open.");
      }
    }
  
    broadcastEvent(from, type, value) {
      const event = new EventMessage(from, type, value);
      this.send(event);
    }
  
    receiveEvent(event) {
      this.handlers.forEach((handler) => handler(event));
    }
  
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    removeHandler(handler) {
      this.handlers = this.handlers.filter((h) => h !== handler);
    }
  }
  
  const GameNotifier = new GameEventNotifier();
  export { GameEvent, GameNotifier };
  