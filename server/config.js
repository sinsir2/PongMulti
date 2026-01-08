export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 80;
export const BALL_RADIUS = 6;
export const PADDLE_SPEED = 5;
export const TICK_RATE = 60;

// Dynamic canvas dimension calculation functions
export function calculateCanvasHeight(leftPlayerCount, rightPlayerCount) {
  const maxPlayersOneSide = Math.max(leftPlayerCount, rightPlayerCount);
  if (maxPlayersOneSide <= 3) return CANVAS_HEIGHT; // 400
  const extraPlayers = maxPlayersOneSide - 3;
  return CANVAS_HEIGHT + (extraPlayers * 120);
}

export function calculateCanvasWidth(totalPlayers) {
  return CANVAS_WIDTH; // Keep width at 600 for now
}

export function calculatePaddleHeight(leftPlayerCount, rightPlayerCount) {
  const maxPlayersOneSide = Math.max(leftPlayerCount, rightPlayerCount);
  if (maxPlayersOneSide <= 2) return PADDLE_HEIGHT; // 80px base

  // Decrease by 10px per player beyond 2, minimum 30px
  const decrease = (maxPlayersOneSide - 2) * 10;
  return Math.max(30, PADDLE_HEIGHT - decrease);
}
