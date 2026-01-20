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

export function calculatePaddleHeight(playerCount) {
  // Fixed paddle heights for each team size (1v1, 2v2, 3v3, etc.)
  const heightMap = {
    1: 80,
    2: 70,
    3: 60,
    4: 50,
    5: 45,
    6: 40,
    7: 35
  };

  // Default to 30px for 8+ players per side
  return heightMap[playerCount] || 30;
}
