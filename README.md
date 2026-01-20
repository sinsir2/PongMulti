# Multiplayer Pong

A real-time multiplayer Pong game built with Vue 3, Vite, and WebSockets. Players can join teams, control individual paddles, and compete against each other with dynamic ball scaling based on player count.

## Features

- **Multiplayer Gameplay**: Multiple players can join and play simultaneously
- **Team Balancing**: Players are automatically assigned to left or right teams to maintain balance
- **Dynamic Ball Scaling**: Ball count increases with player count (formula: `floor(playerCount / 2) - 1`, minimum 1)
- **Individual Scoring**: Track each player's goals while competing as teams
- **Real-time Synchronization**: Server-authoritative game logic ensures fair gameplay
- **Custom Player Colors**: Each player can choose their paddle color

## Game Rules

- **Minimum Players**: 2 players (one on each side) to start
- **Ball Count**:
  - 2-4 players: 1 ball
  - 6 players: 2 balls
  - 8 players: 3 balls
- **Win Condition**: First team to reach `ballCount * 10` points wins
- **Controls**: Arrow Up/Down keys to move your paddle

## Project Setup

### Install Dependencies

```sh
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Running the Game

You need to run both the WebSocket server and the client:

#### Option 1: Run in Separate Terminals

**Terminal 1 - Start WebSocket Server:**
```sh
cd server
npm start
```

**Terminal 2 - Start Vite Dev Server:**
```sh
npm run dev
```

#### Option 2: Manual Commands

```sh
# Terminal 1: WebSocket Server
node server/server.js

# Terminal 2: Client
npm run dev
```

### Testing Multiplayer Locally

1. Start both the server and client
2. Open `http://localhost:5173` in multiple browser tabs/windows
3. Enter different names and colors for each player
4. Join the game - players will be automatically balanced between teams
5. Once you have at least one player on each side, the game starts!

## Ports

- **WebSocket Server**: Port 3001
- **Vite Dev Server**: Port 5173

## Architecture

- **Server-Authoritative**: All game logic, physics, and collision detection runs on the server
- **Client Rendering**: Clients only render game state and send input
- **WebSocket Communication**: Real-time bidirectional communication between server and clients
- **Single Game Room**: All players join one global game instance

## Development

### Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

### Build for Production

```sh
npm run build
```

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).
