import { BALL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';

export class Ball {
  constructor(index = 0) {
    this.radius = BALL_RADIUS;
    this.baseVx = 0;  // Store base velocities for acceleration
    this.baseVy = 0;
    this.ticksSinceReset = 0;  // Track time for speed increase
    this.spinVy = 0;  // Track accumulated spin from paddle hits
    this.reset();

    // Stagger initial direction for multiple balls
    if (index % 2 === 0) {
      this.vx *= -1;
      this.baseVx *= -1;
    }
  }

  reset(canvasWidth = CANVAS_WIDTH, canvasHeight = CANVAS_HEIGHT) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;

    // Scale velocities based on canvas height to maintain consistent feel
    const heightScale = canvasHeight / CANVAS_HEIGHT;
    this.baseVx = (Math.random() > 0.5 ? 4 : -4) * heightScale;
    this.baseVy = (Math.random() - 0.5) * 6 * heightScale;
    this.vx = this.baseVx;
    this.vy = this.baseVy;
    this.ticksSinceReset = 0;  // Reset timer
    this.spinVy = 0;  // Clear accumulated spin
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  checkWallCollision(canvasHeight = CANVAS_HEIGHT) {
    // Top boundary - clamp position and ensure ball moves downward
    if (this.y < this.radius) {
      this.y = this.radius;
      this.baseVy = Math.abs(this.baseVy);  // Make baseVy positive (downward)
      this.spinVy = Math.abs(this.spinVy);  // Also flip spin to match direction
    }

    // Bottom boundary - clamp position and ensure ball moves upward
    if (this.y > canvasHeight - this.radius) {
      this.y = canvasHeight - this.radius;
      this.baseVy = -Math.abs(this.baseVy);  // Make baseVy negative (upward)
      this.spinVy = -Math.abs(this.spinVy);  // Also flip spin to match direction
    }
  }

  updateSpeed() {
    this.ticksSinceReset++;
    // Exponential growth: 1.5% increase per second (compounding)
    const speedMultiplier = Math.pow(1.015, this.ticksSinceReset / 60);
    this.vx = this.baseVx * speedMultiplier;
    this.vy = (this.baseVy + this.spinVy) * speedMultiplier;
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
