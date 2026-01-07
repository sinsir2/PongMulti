<template>
  <div class="game-canvas-container">
    <canvas
      ref="canvas"
      width="600"
      height="400"
      tabindex="0"
      @keydown="handleKeyDown"
      @keyup="handleKeyUp"
    ></canvas>

    <div v-if="gameStatus === 'ENDED'" class="game-over">
      <h3>Game Over!</h3>
      <p class="final-score">{{ leftScore }} : {{ rightScore }}</p>
      <p class="reload-message">Refresh the page to play again</p>
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
      currentInput: 'stop'
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.focus();

    // Start render loop (interpolation for smooth rendering)
    requestAnimationFrame(this.renderLoop);
  },
  methods: {
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

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 600, 400);

      // Draw center line
      ctx.strokeStyle = '#444';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(300, 400);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw all paddles
      this.players.forEach(player => {
        ctx.fillStyle = player.paddle.color;
        ctx.fillRect(
          player.paddle.x,
          player.paddle.y,
          player.paddle.width,
          player.paddle.height
        );

        // Highlight own paddle
        if (player.id === this.myPlayerId) {
          ctx.strokeStyle = '#ff0';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            player.paddle.x,
            player.paddle.y,
            player.paddle.width,
            player.paddle.height
          );
        }

        // Draw player name above paddle
        ctx.fillStyle = player.paddle.color;
        ctx.font = '12px Arial';
        ctx.textAlign = player.side === 'left' ? 'left' : 'right';
        ctx.fillText(
          player.name,
          player.side === 'left' ? player.paddle.x + 15 : player.paddle.x - 5,
          player.paddle.y - 5
        );
      });

      // Draw all balls
      this.balls.forEach(ball => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw scores
      ctx.fillStyle = '#fff';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.leftScore} : ${this.rightScore}`, 300, 50);

      // Draw target score
      ctx.font = '14px Arial';
      ctx.fillText(`First to ${this.targetScore}`, 300, 70);
    }
  }
};
</script>

<style scoped>
.game-canvas-container {
  position: relative;
  display: inline-block;
}

canvas {
  border: 2px solid #333;
  background: black;
  outline: none;
  display: block;
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

.reload-message {
  font-size: 14px;
  color: #aaa;
  margin-top: 20px;
}
</style>
