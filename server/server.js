import { WebSocketServer } from 'ws';
import { GameState } from './GameState.js';
import { randomBytes } from 'crypto';

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

// Single global game room
const gameState = new GameState();

function generateId() {
  return randomBytes(16).toString('hex');
}

console.log(`WebSocket server started on port ${PORT}`);

wss.on('connection', (ws) => {
  const playerId = generateId();
  console.log(`New connection: ${playerId}`);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'join') {
        // Assign to left/right side based on player count
        const side = gameState.assignSide();
        const player = gameState.addPlayer(playerId, msg.name, msg.color, side, ws);

        console.log(`Player ${msg.name} joined on ${side} side`);

        // Send full state to new player
        ws.send(JSON.stringify({
          type: 'init',
          playerId,
          gameState: gameState.serialize()
        }));

        // Broadcast player joined to others
        broadcast({
          type: 'playerJoined',
          player: player.serialize()
        }, playerId);

        // Check if game can start (min 2 players, one per side)
        if (gameState.canStart() && gameState.gameStatus === 'WAITING') {
          gameState.startGame();
          broadcast({ type: 'gameStarted' });
          console.log('Game started!');
        }
      }

      if (msg.type === 'input') {
        gameState.setPlayerInput(playerId, msg.direction);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Player disconnected: ${playerId}`);
    gameState.removePlayer(playerId);
    broadcast({ type: 'playerLeft', playerId });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function broadcast(message, excludeId = null) {
  const messageStr = JSON.stringify(message);
  gameState.players.forEach((player, id) => {
    if (id !== excludeId && player.ws.readyState === 1) { // WebSocket.OPEN
      player.ws.send(messageStr);
    }
  });
}
