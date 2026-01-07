import { BALL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';

export class Ball {
  constructor(index = 0) {
    this.radius = BALL_RADIUS;
    this.reset();

    // Stagger initial direction for multiple balls
    if (index % 2 === 0) {
      this.vx *= -1;
    }
  }

  reset() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.vx = Math.random() > 0.5 ? 4 : -4;
    this.vy = (Math.random() - 0.5) * 6;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  checkWallCollision() {
    if (this.y < this.radius || this.y > CANVAS_HEIGHT - this.radius) {
      this.vy *= -1;
    }
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius,
      vx: this.vx,
      vy: this.vy
    };
  }
}
