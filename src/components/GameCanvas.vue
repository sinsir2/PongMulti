<template>
  <div class="game-canvas-container" @click="focusCanvas">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      tabindex="0"
      @keydown="handleKeyDown"
      @keyup="handleKeyUp"
    ></canvas>

    <div v-if="gameStatus === 'ENDED'" class="game-over">
      <h3>Game Over!</h3>
      <p class="final-score">{{ leftScore }} : {{ rightScore }}</p>
      <button @click="$emit('restart')" class="restart-button">
        Play Again
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCanvas',
  props: {
    players: Array,
    balls: Array,
    leftScore: Number,
    rightScore: Number,
    gameStatus: String,
    targetScore: Number,
    myPlayerId: String
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      currentInput: 'stop',
      containerWidth: 0
    };
  },
  computed: {
    playerCount() {
      return this.players.length;
    },
    canvasWidth() {
      const BASE_WIDTH = 600;
      if (this.playerCount <= 3) {
        return BASE_WIDTH;
      } else if (this.playerCount >= 8) {
        return this.containerWidth || BASE_WIDTH;
      } else {
        // Linear interpolation for players 4-7
        const scaleFactor = (this.playerCount - 3) / 5; // 0 to 1
        const maxWidth = this.containerWidth || BASE_WIDTH;
        return Math.floor(BASE_WIDTH + (maxWidth - BASE_WIDTH) * scaleFactor);
      }
    },
    canvasHeight() {
      const ASPECT_RATIO = 1.5; // 600:400 = 3:2 = 1.5
      return Math.floor(this.canvasWidth / ASPECT_RATIO);
    },
    scaleX() {
      return this.canvasWidth / 600;
    },
    scaleY() {
      return this.canvasHeight / 400;
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');

    // Auto-focus canvas
    this.canvas.focus();

    // Re-focus if canvas loses focus
    this.canvas.addEventListener('blur', () => {
      setTimeout(() => this.canvas.focus(), 0);
    });

    // Get container width
    this.updateContainerWidth();
    window.addEventListener('resize', this.updateContainerWidth);

    // Start render loop
    requestAnimationFrame(this.renderLoop);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateContainerWidth);
  },
  methods: {
    focusCanvas() {
      if (this.canvas) {
        this.canvas.focus();
      }
    },

    updateContainerWidth() {
      const container = this.$refs.canvas.parentElement;
      this.containerWidth = container.clientWidth;
    },

    handleKeyDown(event) {
      let newInput = null;

      if (event.key === 'ArrowUp') {
        newInput = 'up';
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        newInput = 'down';
        event.preventDefault();
      }

      if (newInput && newInput !== this.currentInput) {
        this.currentInput = newInput;
        this.$parent.ws.send('input', { direction: newInput });
      }
    },

    handleKeyUp(event) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        this.currentInput = 'stop';
        this.$parent.ws.send('input', { direction: 'stop' });
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

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Draw center line (scaled)
      ctx.strokeStyle = '#444';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(300 * scaleX, 0);
      ctx.lineTo(300 * scaleX, this.canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw all paddles (scaled)
      this.players.forEach(player => {
        ctx.fillStyle = player.paddle.color;
        ctx.fillRect(
          player.paddle.x * scaleX,
          player.paddle.y * scaleY,
          player.paddle.width * scaleX,
          player.paddle.height * scaleY
        );

        // Highlight own paddle
        if (player.id === this.myPlayerId) {
          ctx.strokeStyle = '#ff0';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            player.paddle.x * scaleX,
            player.paddle.y * scaleY,
            player.paddle.width * scaleX,
            player.paddle.height * scaleY
          );
        }

        // Draw player name above paddle (scaled)
        ctx.fillStyle = player.paddle.color;
        ctx.font = `${Math.floor(12 * scaleY)}px Arial`;
        ctx.textAlign = player.side === 'left' ? 'left' : 'right';
        ctx.fillText(
          player.name,
          player.side === 'left' ?
            (player.paddle.x + 15) * scaleX :
            (player.paddle.x - 5) * scaleX,
          (player.paddle.y - 5) * scaleY
        );
      });

      // Draw all balls (scaled)
      this.balls.forEach(ball => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
          ball.x * scaleX,
          ball.y * scaleY,
          ball.radius * Math.min(scaleX, scaleY),
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // Draw scores (scaled)
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.floor(32 * scaleY)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `${this.leftScore} : ${this.rightScore}`,
        300 * scaleX,
        50 * scaleY
      );

      // Draw target score (scaled)
      ctx.font = `${Math.floor(14 * scaleY)}px Arial`;
      ctx.fillText(
        `First to ${this.targetScore}`,
        300 * scaleX,
        70 * scaleY
      );
    }
  }
};
</script>

<style scoped>
.game-canvas-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 100%;
}

canvas {
  border: 2px solid #333;
  background: black;
  outline: none;
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 30px;
  color: white;
  border: 3px solid white;
  border-radius: 10px;
  text-align: center;
  min-width: 300px;
}

.game-over h3 {
  margin: 0 0 20px 0;
  font-size: 32px;
}

.final-score {
  font-size: 48px;
  margin: 20px 0;
  font-weight: bold;
}

.restart-button {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.restart-button:hover {
  background: #45a049;
}
</style>
