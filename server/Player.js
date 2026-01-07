import { Paddle } from './Paddle.js';
import { PADDLE_SPEED, CANVAS_HEIGHT, PADDLE_HEIGHT } from './config.js';

export class Player {
  constructor(id, name, color, side, ws) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.side = side; // 'left' or 'right'
    this.ws = ws;
    this.goals = 0;
    this.input = 'stop'; // 'up', 'down', 'stop'
    this.paddle = new Paddle(0, 0, color);
  }

  updatePosition() {
    if (this.input === 'up') {
      this.paddle.y = Math.max(0, this.paddle.y - PADDLE_SPEED);
    } else if (this.input === 'down') {
      this.paddle.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, this.paddle.y + PADDLE_SPEED);
    }
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      side: this.side,
      goals: this.goals,
      paddle: this.paddle.serialize()
    };
  }
}
