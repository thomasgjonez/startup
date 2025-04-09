export const GameEvent = {
    System: 'system',
    GameStart: 'gameStart',
    GameEnd: 'gameEnd',
    GameUpdate: 'gameUpdate',
    DescriberSelected: 'describerSelected',
    Chat: 'chat',
  };
  
  export class EventMessage {
    constructor(from, type, value) {
      this.from = from;
      this.type = type;
      this.value = value;
    }
  }