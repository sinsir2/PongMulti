<template>
  <div class="pong-container">
    <h2>Multiplayer Pong</h2>

    <LoginScreen
      v-if="gameState === 'LOGIN'"
      @join="handleJoin"
    />

    <WaitingRoom
      v-if="gameState === 'WAITING'"
      :players="players"
      :canStart="canStart"
    />

    <div v-if="gameState === 'PLAYING' || gameState === 'ENDED'">
      <GameCanvas
        :players="players"
        :balls="balls"
        :leftScore="leftScore"
        :rightScore="rightScore"
        :gameStatus="gameState"
        :targetScore="targetScore"
        :myPlayerId="myPlayerId"
      />

      <Scoreboard
        :players="players"
        :leftScore="leftScore"
        :rightScore="rightScore"
      />
    </div>
  </div>
</template>

<script>
import LoginScreen from './components/LoginScreen.vue';
import WaitingRoom from './components/WaitingRoom.vue';
import GameCanvas from './components/GameCanvas.vue';
import Scoreboard from './components/Scoreboard.vue';
import WebSocketService from './services/websocket.js';

export default {
  name: 'App',
  components: {
    LoginScreen,
    WaitingRoom,
    GameCanvas,
    Scoreboard
  },
  data() {
    return {
      gameState: 'LOGIN', // LOGIN, WAITING, PLAYING, ENDED
      myPlayerId: null,
      players: [],
      balls: [],
      leftScore: 0,
      rightScore: 0,
      targetScore: 10,
      ws: null
    };
  },
  computed: {
    canStart() {
      const leftCount = this.players.filter(p => p.side === 'left').length;
      const rightCount = this.players.filter(p => p.side === 'right').length;
      return leftCount > 0 && rightCount > 0;
    }
  },
  methods: {
    handleJoin({ name, color }) {
      this.ws = new WebSocketService('ws://localhost:3001');

      this.ws.on('init', (data) => {
        this.myPlayerId = data.playerId;
        this.updateState(data.gameState);
      });

      this.ws.on('state', (data) => {
        this.updateState(data);
      });

      this.ws.on('playerJoined', (data) => {
        this.players.push(data.player);
      });

      this.ws.on('playerLeft', (data) => {
        this.players = this.players.filter(p => p.id !== data.playerId);
      });

      this.ws.on('gameStarted', () => {
        this.gameState = 'PLAYING';
      });

      this.ws.on('gameEnded', (data) => {
        this.gameState = 'ENDED';
      });

      this.ws.send('join', { name, color });
      this.gameState = 'WAITING';
    },

    updateState(state) {
      this.players = state.players;
      this.balls = state.balls;
      this.leftScore = state.leftScore;
      this.rightScore = state.rightScore;
      this.targetScore = state.targetScore;

      if (state.gameStatus === 'PLAYING') {
        this.gameState = 'PLAYING';
      } else if (state.gameStatus === 'ENDED') {
        this.gameState = 'ENDED';
      }
    }
  }
};
</script>

<style scoped>
.pong-container {
  text-align: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

h2 {
  color: #fff;
  margin-bottom: 30px;
  font-size: 36px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
