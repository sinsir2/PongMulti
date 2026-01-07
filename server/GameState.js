import { Player } from './Player.js';
import { Ball } from './Ball.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH, TICK_RATE } from './config.js';

export class GameState {
  constructor() {
    this.players = new Map(); // playerId -> Player
    this.leftPlayers = [];    // Array of Player references
    this.rightPlayers = [];   // Array of Player references
    this.balls = [];          // Array of Ball instances
    this.leftScore = 0;
    this.rightScore = 0;
    this.targetScore = 10;
    this.gameStatus = 'WAITING'; // WAITING, PLAYING, ENDED
    this.tickInterval = null;
  }

  assignSide() {
    // Return 'left' or 'right' based on which has fewer players
    return this.leftPlayers.length <= this.rightPlayers.length ? 'left' : 'right';
  }

  addPlayer(id, name, color, side, ws) {
    const player = new Player(id, name, color, side, ws);
    this.players.set(id, player);

    if (side === 'left') {
      this.leftPlayers.push(player);
    } else {
      this.rightPlayers.push(player);
    }

    // Position paddle on their side
    this.positionPaddle(player);

    return player;
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (!player) return;

    // Remove from side array
    if (player.side === 'left') {
      this.leftPlayers = this.leftPlayers.filter(p => p.id !== id);
    } else {
      this.rightPlayers = this.rightPlayers.filter(p => p.id !== id);
    }

    this.players.delete(id);

    // Reposition remaining paddles
    this.repositionPaddles(player.side);
  }

  positionPaddle(player) {
    const side = player.side;
    const playersOnSide = side === 'left' ? this.leftPlayers : this.rightPlayers;
    const index = playersOnSide.indexOf(player);
    const count = playersOnSide.length;

    // Stack paddles vertically
    const x = side === 'left' ? 0 : (CANVAS_WIDTH - PADDLE_WIDTH);
    const spacing = CANVAS_HEIGHT / (count + 1);
    const y = spacing * (index + 1) - PADDLE_HEIGHT / 2;

    player.paddle.x = x;
    player.paddle.y = y;
  }

  repositionPaddles(side) {
    const players = side === 'left' ? this.leftPlayers : this.rightPlayers;
    players.forEach(player => this.positionPaddle(player));
  }

  canStart() {
    return this.leftPlayers.length > 0 && this.rightPlayers.length > 0;
  }

  startGame() {
    if (this.gameStatus === 'PLAYING') return;

    this.gameStatus = 'PLAYING';
    this.leftScore = 0;
    this.rightScore = 0;

    // Reset player goals
    this.players.forEach(player => {
      player.goals = 0;
    });

    // Calculate ball count: (playerCount / 2) - 1, minimum 1
    const totalPlayers = this.players.size;
    const ballCount = Math.max(1, Math.floor(totalPlayers / 2) - 1);

    // Calculate target score: ballCount * 10
    this.targetScore = ballCount * 10;

    // Spawn balls
    this.balls = [];
    for (let i = 0; i < ballCount; i++) {
      this.balls.push(new Ball(i));
    }

    // Start game loop at 60 ticks/second
    this.tickInterval = setInterval(() => this.tick(), 1000 / TICK_RATE);
  }

  tick() {
    // Update all paddle positions based on input
    this.players.forEach(player => {
      player.updatePosition();
    });

    // Update all balls
    this.balls.forEach(ball => {
      ball.move();

      // Check wall collisions (top/bottom)
      ball.checkWallCollision();

      // Check paddle collisions
      this.checkPaddleCollisions(ball);

      // Check scoring
      if (ball.x < 0) {
        this.rightScore++;
        this.scoreBy(this.rightPlayers, ball);
        ball.reset();

        if (this.rightScore >= this.targetScore) {
          this.endGame('right');
        }
      }

      if (ball.x > CANVAS_WIDTH) {
        this.leftScore++;
        this.scoreBy(this.leftPlayers, ball);
        ball.reset();

        if (this.leftScore >= this.targetScore) {
          this.endGame('left');
        }
      }
    });

    // Broadcast state to all clients
    this.broadcast();
  }

  checkPaddleCollisions(ball) {
    // Check left side paddles
    if (ball.vx < 0) { // Moving left
      for (const player of this.leftPlayers) {
        if (player.paddle.collidesWith(ball)) {
          ball.vx *= -1;
          // Add spin based on where ball hits paddle
          const hitOffset = ball.y - (player.paddle.y + player.paddle.height / 2);
          ball.vy += hitOffset * 0.1;
          break;
        }
      }
    }

    // Check right side paddles
    if (ball.vx > 0) { // Moving right
      for (const player of this.rightPlayers) {
        if (player.paddle.collidesWith(ball)) {
          ball.vx *= -1;
          const hitOffset = ball.y - (player.paddle.y + player.paddle.height / 2);
          ball.vy += hitOffset * 0.1;
          break;
        }
      }
    }
  }

  scoreBy(players, ball) {
    if (players.length === 0) return;

    // Find closest paddle to ball when it scored
    let closestPlayer = players[0];
    let minDist = Infinity;

    for (const player of players) {
      const dist = Math.abs(ball.y - (player.paddle.y + player.paddle.height / 2));
      if (dist < minDist) {
        minDist = dist;
        closestPlayer = player;
      }
    }

    closestPlayer.goals++;
  }

  setPlayerInput(playerId, direction) {
    const player = this.players.get(playerId);
    if (player) {
      player.input = direction; // 'up', 'down', or 'stop'
    }
  }

  serialize() {
    return {
      players: Array.from(this.players.values()).map(p => p.serialize()),
      balls: this.balls.map(b => b.serialize()),
      leftScore: this.leftScore,
      rightScore: this.rightScore,
      gameStatus: this.gameStatus,
      targetScore: this.targetScore
    };
  }

  broadcast() {
    const state = this.serialize();
    const message = JSON.stringify({ type: 'state', ...state });

    this.players.forEach(player => {
      if (player.ws.readyState === 1) { // WebSocket.OPEN
        player.ws.send(message);
      }
    });
  }

  endGame(winningSide) {
    this.gameStatus = 'ENDED';
    clearInterval(this.tickInterval);

    this.broadcast();
    this.players.forEach(player => {
      if (player.ws.readyState === 1) { // WebSocket.OPEN
        player.ws.send(JSON.stringify({
          type: 'gameEnded',
          winner: winningSide
        }));
      }
    });
  }

  resetGame() {
    console.log('Resetting game to WAITING state');
    this.gameStatus = 'WAITING';
    this.leftScore = 0;
    this.rightScore = 0;
    this.balls = [];

    // Reset all player goals
    this.players.forEach(player => {
      player.goals = 0;
    });

    // Clear game loop if running
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}
