<template>
  <div class="game-container" @click="focusCanvas">
    <!-- Game Canvas -->
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      tabindex="0"
      @keydown="handleKeyDown"
      @keyup="handleKeyUp"
    ></canvas>

    <!-- HUD Overlay -->
    <div class="hud-overlay">
      <!-- Top HUD -->
      <div class="hud-top">
        <div class="team-score left-score">
          <span class="team-label">LEFT</span>
          <span class="score-value">{{ leftScore }}</span>
        </div>

        <div class="game-target">
          <span class="target-label">First to {{ targetScore }}</span>
        </div>

        <div class="team-score right-score">
          <span class="team-label">RIGHT</span>
          <span class="score-value">{{ rightScore }}</span>
        </div>
      </div>

      <!-- Fullscreen Toggle Button -->
      <button
        class="fullscreen-btn"
        @click="toggleFullscreen"
        :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
      >
        <span v-if="!isFullscreen">⛶</span>
        <span v-else>⛶</span>
      </button>

      <!-- Controls Hint (fades out after first input) -->
      <div v-if="showControlsHint" class="controls-hint">
        <kbd>W</kbd> <kbd>S</kbd> or <kbd>↑</kbd> <kbd>↓</kbd> to move
      </div>
    </div>

    <!-- Game Over Overlay -->
    <Transition name="fade">
      <div v-if="gameStatus === 'ENDED'" class="game-over-overlay">
        <div class="game-over-content">
          <!-- Confetti Effect -->
          <div class="confetti-container">
            <div
              v-for="i in 50"
              :key="i"
              class="confetti-piece"
              :style="getConfettiStyle(i)"
            ></div>
          </div>

          <!-- Victory Content -->
          <div class="victory-section">
            <div class="trophy-icon">🏆</div>
            <h2 class="victory-title">{{ winnerText }} Wins!</h2>
            <div class="final-score">
              <span class="score left" :class="{ winner: winner === 'left' }">{{
                leftScore
              }}</span>
              <span class="score-divider">—</span>
              <span
                class="score right"
                :class="{ winner: winner === 'right' }"
                >{{ rightScore }}</span
              >
            </div>
          </div>

          <!-- Returning Countdown -->
          <div class="returning-section">
            <div class="loading-spinner"></div>
            <p>Returning to lobby...</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "GameCanvas",
  props: {
    players: Array,
    balls: Array,
    leftScore: Number,
    rightScore: Number,
    gameStatus: String,
    targetScore: Number,
    myPlayerId: String,
    serverCanvasWidth: Number,
    serverCanvasHeight: Number,
    winner: String,
    sidebarCollapsed: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      currentInput: "stop",
      viewportWidth: 0,
      viewportHeight: 0,
      showControlsHint: true,
      gridPattern: null,
      isFullscreen: false,
    };
  },
  computed: {
    playerCount() {
      return this.players.length;
    },
    canvasWidth() {
      // Calculate display width to fill viewport
      // Leave room for sidebar if expanded
      const sidebarWidth = this.sidebarCollapsed ? 50 : 320;
      const availableWidth = this.viewportWidth - sidebarWidth;

      const serverAspect =
        (this.serverCanvasWidth || 600) / (this.serverCanvasHeight || 400);
      const viewportAspect = availableWidth / this.viewportHeight;

      if (viewportAspect > serverAspect) {
        // Fit to height
        return Math.floor(this.viewportHeight * 0.9 * serverAspect);
      } else {
        // Fit to width
        return Math.floor(availableWidth * 0.95);
      }
    },
    canvasHeight() {
      const serverAspect =
        (this.serverCanvasWidth || 600) / (this.serverCanvasHeight || 400);
      return Math.floor(this.canvasWidth / serverAspect);
    },
    scaleX() {
      return this.canvasWidth / (this.serverCanvasWidth || 600);
    },
    scaleY() {
      return this.canvasHeight / (this.serverCanvasHeight || 400);
    },
    winnerText() {
      return this.winner === "left" ? "Left Team" : "Right Team";
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");

    // Auto-focus canvas
    this.canvas.focus();

    // Re-focus if canvas loses focus
    this.canvas.addEventListener("blur", () => {
      setTimeout(() => this.canvas.focus(), 0);
    });

    // Get container width
    this.updateContainerWidth();
    window.addEventListener("resize", this.updateContainerWidth);

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", this.handleFullscreenChange);

    // Create grid pattern
    this.createGridPattern();

    // Start render loop
    requestAnimationFrame(this.renderLoop);

    // Hide controls hint after 5 seconds
    setTimeout(() => {
      this.showControlsHint = false;
    }, 5000);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateContainerWidth);
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange,
    );
  },
  methods: {
    focusCanvas() {
      if (this.canvas) {
        this.canvas.focus();
      }
    },

    updateContainerWidth() {
      this.viewportWidth = window.innerWidth;
      this.viewportHeight = window.innerHeight;
    },

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Error entering fullscreen:", err);
        });
      } else {
        // Exit fullscreen
        document.exitFullscreen().catch((err) => {
          console.log("Error exiting fullscreen:", err);
        });
      }
    },

    handleFullscreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
      // Update viewport after fullscreen change
      this.$nextTick(() => {
        this.updateContainerWidth();
      });
    },

    createGridPattern() {
      // Create a smaller canvas for the grid pattern
      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = 40;
      patternCanvas.height = 40;
      const pctx = patternCanvas.getContext("2d");

      pctx.strokeStyle = "rgba(0, 245, 255, 0.05)";
      pctx.lineWidth = 1;

      // Vertical line
      pctx.beginPath();
      pctx.moveTo(40, 0);
      pctx.lineTo(40, 40);
      pctx.stroke();

      // Horizontal line
      pctx.beginPath();
      pctx.moveTo(0, 40);
      pctx.lineTo(40, 40);
      pctx.stroke();

      this.gridPattern = this.ctx.createPattern(patternCanvas, "repeat");
    },

    handleKeyDown(event) {
      let newInput = null;

      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        newInput = "up";
        event.preventDefault();
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        newInput = "down";
        event.preventDefault();
      }

      if (newInput && newInput !== this.currentInput) {
        this.currentInput = newInput;
        this.showControlsHint = false; // Hide hint on first input
        this.$parent.ws.send("input", { direction: newInput });
      }
    },

    handleKeyUp(event) {
      const key = event.key;
      if (
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "w" ||
        key === "W" ||
        key === "s" ||
        key === "S"
      ) {
        this.currentInput = "stop";
        this.$parent.ws.send("input", { direction: "stop" });
        event.preventDefault();
      }
    },

    renderLoop() {
      this.draw();
      requestAnimationFrame(this.renderLoop);
    },

    draw() {
      const ctx = this.ctx;
      const scaleX = this.scaleX;
      const scaleY = this.scaleY;

      // Clear canvas with dark background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Draw grid pattern
      if (this.gridPattern) {
        ctx.fillStyle = this.gridPattern;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      }

      // Draw glowing center line
      const centerX = (this.serverCanvasWidth / 2) * scaleX;

      // Glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(255, 0, 255, 0.5)";

      ctx.strokeStyle = "rgba(255, 0, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([15, 10]);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, this.canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.shadowBlur = 0;

      // Draw all paddles
      this.players.forEach((player) => {
        const isMyPaddle = player.id === this.myPlayerId;

        // Paddle glow
        if (isMyPaddle) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = player.paddle.color;
        }

        // Draw paddle
        ctx.fillStyle = player.paddle.color;
        ctx.beginPath();
        ctx.roundRect(
          player.paddle.x * scaleX,
          player.paddle.y * scaleY,
          player.paddle.width * scaleX,
          player.paddle.height * scaleY,
          4,
        );
        ctx.fill();

        // Highlight own paddle with border
        if (isMyPaddle) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw player name
        ctx.fillStyle = player.paddle.color;
        ctx.font = `bold ${Math.floor(11 * Math.min(scaleX, scaleY))}px Inter, sans-serif`;
        ctx.textAlign = player.side === "left" ? "left" : "right";

        const nameX =
          player.side === "left"
            ? (player.paddle.x + player.paddle.width + 8) * scaleX
            : (player.paddle.x - 8) * scaleX;
        const nameY = (player.paddle.y + player.paddle.height / 2 + 4) * scaleY;

        ctx.fillText(player.name, nameX, nameY);
      });

      // Draw all balls with glow
      this.balls.forEach((ball) => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffffff";

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(
          ball.x * scaleX,
          ball.y * scaleY,
          ball.radius * Math.min(scaleX, scaleY),
          0,
          Math.PI * 2,
        );
        ctx.fill();

        ctx.shadowBlur = 0;
      });
    },

    getConfettiStyle(index) {
      const colors = [
        "#00f5ff",
        "#ff00ff",
        "#00ff88",
        "#ffaa00",
        "#7b2fff",
        "#ffffff",
      ];
      const color = colors[index % colors.length];
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const size = 6 + Math.random() * 8;

      return {
        left: `${left}%`,
        background: color,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      };
    },
  },
};
</script>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
  z-index: 10;
  overflow: hidden;
}

canvas {
  border-radius: var(--radius-md);
  outline: none;
  display: block;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 60px rgba(0, 245, 255, 0.1),
    0 0 100px rgba(255, 0, 255, 0.05);
}

/* HUD Overlay */
.hud-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 20;
}

.hud-top {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 12px 32px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}

.team-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.team-label {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.left-score .team-label {
  color: var(--success);
}

.right-score .team-label {
  color: var(--accent-primary);
}

.score-value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.game-target {
  padding: 0 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.target-label {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

/* Fullscreen Button */
.fullscreen-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  pointer-events: auto;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: scale(1.05);
}

/* Controls Hint */
.controls-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
  animation:
    fadeIn 0.5s ease-out,
    pulse 2s ease-in-out infinite;
}

.controls-hint kbd {
  display: inline-block;
  padding: 4px 10px;
  font-family: var(--font-body);
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  margin: 0 4px;
}

/* Game Over Overlay */
.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
}

.game-over-content {
  text-align: center;
  position: relative;
}

/* Confetti */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation: confetti-fall 3s ease-out forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Victory Section */
.victory-section {
  animation: scaleIn 0.5s ease-out;
}

.trophy-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 2s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
}

.victory-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 30px;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
}

.final-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.final-score .score {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 700;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.final-score .score.winner {
  color: var(--text-primary);
  text-shadow: 0 0 30px currentColor;
}

.final-score .score.left.winner {
  color: var(--success);
}

.final-score .score.right.winner {
  color: var(--accent-primary);
}

.score-divider {
  font-size: 40px;
  color: var(--text-muted);
}

/* Returning Section */
.returning-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-secondary);
  animation: fadeIn 0.5s ease-out 0.5s both;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--glass-border);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
