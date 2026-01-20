# 🏓 Multiplayer Pong

A modern, real-time multiplayer Pong game with a sleek arcade-style UI. Play with friends in your browser!

![Multiplayer Pong](https://img.shields.io/badge/Game-Multiplayer%20Pong-00f5ff?style=for-the-badge)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-ff00ff?style=for-the-badge)

## ✨ Features

- **Real-time Multiplayer** - Play with multiple players on each side
- **Dynamic Teams** - Automatic team balancing
- **Responsive Design** - Optimized for desktop/laptop displays
- **Modern UI** - Glassmorphism effects, animations, and neon accents
- **Live Stats** - Track individual goals and team scores
- **Custom Colors** - Choose your paddle color

## 🚀 Quick Start

### Development

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Start the WebSocket server (terminal 1)
cd server && npm start

# Start the frontend dev server (terminal 2)
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production with Docker

```bash
# Build and start all containers
docker compose up -d --build

# View logs
docker compose logs -f
```

The app will be available on port `3000`.

## 🐳 Docker Deployment

This project is designed for deployment with **Dockge** and **Nginx Proxy Manager**.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Nginx Proxy Manager                  │
│              (Your existing setup)                   │
└─────────────────────┬───────────────────────────────┘
                      │ Routes to port 3000
┌─────────────────────▼───────────────────────────────┐
│              pong-proxy (nginx:alpine)              │
│                    Port 3000                         │
├─────────────────────┬───────────────────────────────┤
│         /ws         │            /*                  │
│    WebSocket        │        Static Files            │
└──────────┬──────────┴──────────────┬────────────────┘
           │                         │
┌──────────▼──────────┐  ┌───────────▼────────────────┐
│    pong-backend     │  │      pong-frontend         │
│   (Node.js:3001)    │  │     (nginx:80)             │
│   WebSocket Server  │  │   Vue.js Static Files      │
└─────────────────────┘  └────────────────────────────┘
```

### Setup with Dockge

1. **Clone/Upload the project** to your server
2. **Create a new stack** in Dockge
3. **Copy the docker-compose.yml** content
4. **Deploy the stack**

### Nginx Proxy Manager Configuration

Create a new Proxy Host:

| Setting             | Value                         |
| ------------------- | ----------------------------- |
| Domain              | `pong.yourdomain.com`         |
| Scheme              | `http`                        |
| Forward Hostname/IP | `pong-proxy` (container name) |
| Forward Port        | `3000`                        |
| Websockets Support  | ✅ **Enabled**                |

> ⚠️ **Important**: Enable "Websockets Support" for real-time gameplay!

If using SSL:

- Enable "Force SSL"
- Request a new SSL certificate

### Environment Variables

No environment variables required! The app automatically detects:

- Development mode: Connects to `ws://localhost:3001`
- Production mode: Connects to `wss://yourdomain.com/ws`

## 🎮 How to Play

1. **Enter your name** and choose a paddle color
2. **Wait for players** on both teams (at least 1 per side)
3. **Start the game** when ready
4. **Use Arrow Keys** (↑ ↓) to move your paddle
5. **Score goals** by getting the ball past the opponent

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Vite
- **Backend**: Node.js, WebSocket (ws)
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Orbitron, Inter (Google Fonts)
- **Deployment**: Docker, Nginx

## 📁 Project Structure

```
PongMulti/
├── src/                    # Vue.js frontend
│   ├── components/         # Vue components
│   ├── services/           # WebSocket service
│   ├── styles.css          # Global styles
│   ├── App.vue             # Main app component
│   └── main.js             # Entry point
├── server/                 # Node.js backend
│   ├── server.js           # WebSocket server
│   ├── GameState.js        # Game logic
│   ├── Ball.js             # Ball physics
│   ├── Paddle.js           # Paddle logic
│   └── Player.js           # Player management
├── docker-compose.yml      # Docker orchestration
├── Dockerfile.frontend     # Frontend container
├── Dockerfile.backend      # Backend container
├── nginx-proxy.conf        # Internal proxy config
└── nginx.conf              # Frontend static server
```

## 📄 License

MIT License - feel free to use and modify!
