<template>
  <div class="pong-container">
    <h2>Pong</h2>
    <canvas
        ref="canvas"
        width="600"
        height="400"
        @mousemove="movePaddle"
    ></canvas>
    <p>{{ playerScore }} : {{ aiScore }}</p>
  </div>
</template>

<script>
export default {
  name: "PongGame",
  data() {
    return {
      canvas: null,
      ctx: null,

      playerScore: 0,
      aiScore: 0,

      paddleWidth: 10,
      paddleHeight: 80,

      playerY: 160,
      aiY: 160,

      ballX: 300,
      ballY: 200,
      ballRadius: 6,
      ballSpeedX: 4,
      ballSpeedY: 3,
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    requestAnimationFrame(this.gameLoop);
  },
  methods: {
    movePaddle(event) {
      const rect = this.canvas.getBoundingClientRect();
      this.playerY =
          event.clientY - rect.top - this.paddleHeight / 2;
    },

    resetBall() {
      this.ballX = this.canvas.width / 2;
      this.ballY = this.canvas.height / 2;
      this.ballSpeedX = -this.ballSpeedX;
    },

    update() {
      // Move ball
      this.ballX += this.ballSpeedX;
      this.ballY += this.ballSpeedY;

      // Wall collision
      if (
          this.ballY < this.ballRadius ||
          this.ballY > this.canvas.height - this.ballRadius
      ) {
        this.ballSpeedY *= -1;
      }

      // Player paddle collision
      if (
          this.ballX < this.paddleWidth + this.ballRadius &&
          this.ballY > this.playerY &&
          this.ballY < this.playerY + this.paddleHeight
      ) {
        this.ballSpeedX *= -1;
      }

      // AI paddle collision
      if (
          this.ballX >
          this.canvas.width -
          this.paddleWidth -
          this.ballRadius &&
          this.ballY > this.aiY &&
          this.ballY < this.aiY + this.paddleHeight
      ) {
        this.ballSpeedX *= -1;
      }

      // Scoring
      if (this.ballX < 0) {
        this.aiScore++;
        this.resetBall();
      }

      if (this.ballX > this.canvas.width) {
        this.playerScore++;
        this.resetBall();
      }

      // Simple AI
      this.aiY +=
          (this.ballY - (this.aiY + this.paddleHeight / 2)) * 0.05;
    },

    draw() {
      const ctx = this.ctx;

      // Clear
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Paddles
      ctx.fillStyle = "#fff";
      ctx.fillRect(
          0,
          this.playerY,
          this.paddleWidth,
          this.paddleHeight
      );
      ctx.fillRect(
          this.canvas.width - this.paddleWidth,
          this.aiY,
          this.paddleWidth,
          this.paddleHeight
      );

      // Ball
      ctx.beginPath();
      ctx.arc(
          this.ballX,
          this.ballY,
          this.ballRadius,
          0,
          Math.PI * 2
      );
      ctx.fill();
    },

    gameLoop() {
      this.update();
      this.draw();
      requestAnimationFrame(this.gameLoop);
    },
  },
};
</script>

<style scoped>
.pong-container {
  text-align: center;
}

canvas {
  border: 2px solid #333;
  background: black;
}
</style>
