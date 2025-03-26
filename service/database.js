const { MongoClient } = require('mongodb');
const config = require('../service/dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database cluster
const client = new MongoClient(url);
const db = client.db('catchphrase');
const userCollection = db.collection('user');
const gameCollection = db.collection('game');
const chatCollection = db.collection('chat');

(async function testConnection() {
    try {
      await db.command({ ping: 1 });
      console.log(`Connect to database`);
    } catch (ex) {
      console.log(`Unable to connect to database with ${url} because ${ex.message}`);
      process.exit(1);
    }
  })();

  function getUser(username) {
    return userCollection.findOne({ username: username  });
  }
  
  function getUserByToken(token) {
    return userCollection.findOne({ token: token });
  }
  
  async function addUser(user) {
    await userCollection.insertOne(user);
  }
  
  async function updateUser(user) {
    await userCollection.updateOne({ username: user.username }, { $set: user });
  }

  async function updateUserToken(username, token) {
  await userCollection.updateOne(
    { username: username },
    { $set: { token: token } }
  );
}

  async function saveGame(game) {
    await gameCollection.updateOne(
      { roomCode: game.roomCode },
      { $set: game },
      { upsert: true }
    );
  }
  
  async function getGame(roomCode) {
    return gameCollection.findOne({ roomCode });
  }
  
  async function addChatMessage({ username, message }) {
    const chatEntry = {
        username,
        message,
      };
    
      await chatCollection.insertOne(chatEntry);
  }
  
  async function getChatMessages() {
    return chatCollection
    .find({})
    .sort({ timestamp: 1 })
    .toArray();
  }

  async function clearChatMessages(){
    return await chatCollection.deleteMany({});
  }

  module.exports = {
    getUser,
    getUserByToken,
    addUser,
    updateUser,
    saveGame,
    getGame,
    addChatMessage,
    getChatMessages,
    updateUserToken,
    clearChatMessages
  };
