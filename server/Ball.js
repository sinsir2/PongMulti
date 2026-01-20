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

  reset(canvasWidth = CANVAS_WIDTH, canvasHeight = CANVAS_HEIGHT) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;

    // Scale velocities based on canvas height to maintain consistent feel
    const heightScale = canvasHeight / CANVAS_HEIGHT;
    this.vx = (Math.random() > 0.5 ? 4 : -4) * heightScale;
    this.vy = (Math.random() - 0.5) * 6 * heightScale;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  checkWallCollision(canvasHeight = CANVAS_HEIGHT) {
    if (this.y < this.radius || this.y > canvasHeight - this.radius) {
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
