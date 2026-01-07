import { PADDLE_WIDTH, PADDLE_HEIGHT } from './config.js';

export class Paddle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.color = color;
  }

  collidesWith(ball) {
    return ball.x - ball.radius < this.x + this.width &&
           ball.x + ball.radius > this.x &&
           ball.y + ball.radius > this.y &&
           ball.y - ball.radius < this.y + this.height;
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.color
    };
  }
}
