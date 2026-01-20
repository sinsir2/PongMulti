<template>
  <div class="pong-app">
    <!-- Animated Background Grid -->
    <div class="background-grid"></div>
    <div class="background-glow"></div>

    <!-- Main Content -->
    <div class="app-content">
      <!-- Header (only show when not in game) -->
      <header
        v-if="gameState !== 'PLAYING' && gameState !== 'ENDED'"
        class="app-header"
      >
        <div class="logo-section">
          <div class="logo-icon">🏓</div>
          <h1 class="logo-title">PONG</h1>
          <span class="logo-subtitle">MULTIPLAYER</span>
        </div>
        <p class="tagline">Challenge your friends in real-time</p>
      </header>

      <!-- Login Screen -->
      <LoginScreen
        v-if="gameState === 'LOGIN'"
        @join="handleJoin"
        class="fade-in-up"
      />

      <!-- Waiting Room -->
      <WaitingRoom
        v-if="gameState === 'WAITING'"
        :players="players"
        :canStart="canStart"
        :lastGameResults="lastGameResults"
        @startGame="handleStartGame"
        @goBack="handleGoBack"
        class="fade-in-up"
      />

      <!-- Game Screen -->
      <div
        v-if="gameState === 'PLAYING' || gameState === 'ENDED'"
        class="game-screen"
      >
        <GameCanvas
          :players="players"
          :balls="balls"
          :leftScore="leftScore"
          :rightScore="rightScore"
          :gameStatus="gameState"
          :targetScore="targetScore"
          :myPlayerId="myPlayerId"
          :serverCanvasWidth="serverCanvasWidth"
          :serverCanvasHeight="serverCanvasHeight"
          :winner="winner"
        />

        <Scoreboard
          :players="players"
          :leftScore="leftScore"
          :rightScore="rightScore"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoginScreen from "./components/LoginScreen.vue";
import WaitingRoom from "./components/WaitingRoom.vue";
import GameCanvas from "./components/GameCanvas.vue";
import Scoreboard from "./components/Scoreboard.vue";
import WebSocketService from "./services/websocket.js";

export default {
  name: "App",
  components: {
    LoginScreen,
    WaitingRoom,
    GameCanvas,
    Scoreboard,
  },
  data() {
    return {
      gameState: "LOGIN", // LOGIN, WAITING, PLAYING, ENDED
      myPlayerId: null,
      players: [],
      balls: [],
      leftScore: 0,
      rightScore: 0,
      targetScore: 10,
      ws: null,
      savedName: "",
      savedColor: "#ffffff",
      serverCanvasWidth: 600,
      serverCanvasHeight: 400,
      winner: null, // Track winning side for game end display
      lastGameResults: null, // Store previous game results
    };
  },
  computed: {
    canStart() {
      const leftCount = this.players.filter((p) => p.side === "left").length;
      const rightCount = this.players.filter((p) => p.side === "right").length;
      return leftCount > 0 && rightCount > 0;
    },
  },
  methods: {
    handleJoin({ name, color }) {
      // Save credentials for restart
      this.savedName = name;
      this.savedColor = color;

      this.ws = new WebSocketService(this.getWebSocketUrl());

      this.ws.on("init", (data) => {
        this.myPlayerId = data.playerId;
        this.updateState(data.gameState);
      });

      this.ws.on("state", (data) => {
        this.updateState(data);
      });

      this.ws.on("playerJoined", (data) => {
        this.players.push(data.player);
      });

      this.ws.on("playerLeft", (data) => {
        this.players = this.players.filter((p) => p.id !== data.playerId);
      });

      this.ws.on("gameStarted", () => {
        this.gameState = "PLAYING";
      });

      this.ws.on("gameEnded", (data) => {
        this.gameState = "ENDED";
        this.winner = data.winner; // Store winner for display

        // Auto-transition to waiting room after brief display
        setTimeout(() => {
          this.gameState = "WAITING";
        }, 3000);
      });

      this.ws.send("join", { name, color });
      this.gameState = "WAITING";
    },

    handleStartGame() {
      // Send startGame message to server
      this.ws.send("startGame", {});
    },

    handleGoBack() {
      // Disconnect from server
      if (this.ws && this.ws.ws) {
        this.ws.ws.close();
      }

      // Reset to login state
      this.gameState = "LOGIN";
      this.players = [];
      this.balls = [];
      this.leftScore = 0;
      this.rightScore = 0;
      this.ws = null;
      this.myPlayerId = null;
    },

    updateState(state) {
      this.players = state.players;
      this.balls = state.balls;
      this.leftScore = state.leftScore;
      this.rightScore = state.rightScore;
      this.targetScore = state.targetScore;

      // Capture server canvas dimensions
      if (state.canvasWidth) this.serverCanvasWidth = state.canvasWidth;
      if (state.canvasHeight) this.serverCanvasHeight = state.canvasHeight;

      // Receive last game results from server
      if (state.lastGameResults) {
        this.lastGameResults = state.lastGameResults;
      }

      if (state.gameStatus === "PLAYING") {
        this.gameState = "PLAYING";
      } else if (state.gameStatus === "ENDED") {
        this.gameState = "ENDED";
      }
    },

    getWebSocketUrl() {
      // In development, use localhost
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        return "ws://localhost:3001";
      }
      // In production, use the same host with WebSocket protocol
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${window.location.host}/ws`;
    },
  },
};
</script>

<style scoped>
.pong-app {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Animated Background */
.background-grid {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridPulse 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.background-glow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(
      ellipse at 20% 20%,
      rgba(123, 47, 255, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      rgba(0, 245, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 50% 50%,
      rgba(255, 0, 255, 0.05) 0%,
      transparent 70%
    ),
    linear-gradient(
      135deg,
      var(--bg-dark) 0%,
      var(--bg-mid) 50%,
      var(--bg-accent) 100%
    );
  pointer-events: none;
  z-index: 0;
}

/* Main Content */
.app-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: var(--space-md);
  overflow-y: auto;
  overflow-x: hidden;
}

/* Header */
.app-header {
  text-align: center;
  margin-bottom: var(--space-lg);
  animation: fadeInDown 0.6s ease-out;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.logo-icon {
  font-size: 36px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(0, 245, 255, 0.5));
}

.logo-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 0.1em;
  background: linear-gradient(
    135deg,
    var(--accent-primary),
    var(--accent-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(0, 245, 255, 0.3));
}

.logo-subtitle {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--accent-secondary);
  padding: 2px var(--space-sm);
  border: 1px solid var(--accent-secondary);
  border-radius: var(--radius-sm);
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.tagline {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

/* Game Screen Layout */
.game-screen {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

/* Animation Classes */
.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
</style>
