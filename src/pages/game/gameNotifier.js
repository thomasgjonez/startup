class EventMessage {
    constructor(from, type, value) {
      this.from = from;
      this.type = type;
      this.value = value;
    }
  }
  
  class GameEventNotifier {
    constructor(roomCode = 'chat') {
      this.events = [];
      this.handlers = [];
      this.roomCode = roomCode;
  
      const port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}`);
  
      this.socket.onopen = () => {
        this.sendEvent('system', 'join', { roomCode: this.roomCode });
        this.sendEvent('system', 'status', { msg: 'connected' });
      };
  
      this.socket.onclose = () => {
        this.sendEvent('system', 'status', { msg: 'disconnected' });
      };
  
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(msg.data);
          this.receiveEvent(event);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };
    }
  
    sendEvent(from, type, value) {
      const event = new EventMessage(from, type, value);
      this.socket.send(JSON.stringify(event));
    }
  
    broadcastChat(username, message) {
      this.sendEvent(username, 'chat', { message });
    }
  
    broadcastGameUpdate(from, value) {
      this.sendEvent(from, 'gameUpdate', value);
    }
  
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    removeHandler(handler) {
      this.handlers = this.handlers.filter((h) => h !== handler);
    }
  
    receiveEvent(event) {
      this.events.push(event);
      this.handlers.forEach(handler => handler(event));
    }
  }
  
  const GameNotifier = new GameEventNotifier();
  export { GameNotifier };
  