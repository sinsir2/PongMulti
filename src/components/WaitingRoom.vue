<template>
  <div class="waiting-room">
    <!-- Connection Status -->
    <div class="connection-status">
      <span class="status-dot"></span>
      <span class="status-text">Connected</span>
    </div>

    <!-- Last Game Results Banner -->
    <div
      v-if="lastGameResults"
      class="results-banner"
      :class="lastGameResults.winner + '-winner'"
    >
      <div class="results-header">
        <span class="trophy">🏆</span>
        <h3>
          {{ lastGameResults.winner === "left" ? "Left Team" : "Right Team" }}
          Wins!
        </h3>
      </div>

      <div class="results-score">
        <span class="score left">{{ lastGameResults.leftScore }}</span>
        <span class="score-divider">—</span>
        <span class="score right">{{ lastGameResults.rightScore }}</span>
      </div>

      <div v-if="mvp" class="mvp-section">
        <span class="mvp-badge">⭐ MVP</span>
        <span class="mvp-name" :style="{ color: mvp.color }">{{
          mvp.name
        }}</span>
        <span class="mvp-goals">{{ mvp.goals }} goals</span>
      </div>
    </div>

    <!-- Status Message -->
    <div class="status-section">
      <div v-if="!canStart" class="status-waiting">
        <div class="waiting-icon">⏳</div>
        <p>Waiting for players on both sides...</p>
        <div class="waiting-dots"><span></span><span></span><span></span></div>
      </div>
      <div v-else class="status-ready">
        <div class="ready-icon">✓</div>
        <p>Ready to play!</p>
      </div>
    </div>

    <!-- Teams Container -->
    <div class="teams-container">
      <!-- Left Team -->
      <div class="team-card left-team">
        <div class="team-header">
          <h4>Left Team</h4>
          <span class="player-count"
            >{{ leftPlayers.length }}
            {{ leftPlayers.length === 1 ? "Player" : "Players" }}</span
          >
        </div>

        <div class="players-list">
          <TransitionGroup name="player">
            <div
              v-for="player in leftPlayers"
              :key="player.id"
              class="player-card"
            >
              <div class="player-avatar" :style="{ background: player.color }">
                {{ getInitials(player.name) }}
              </div>
              <span class="player-name">{{ player.name }}</span>
              <div
                class="player-paddle"
                :style="{ background: player.color }"
              ></div>
            </div>
          </TransitionGroup>

          <div v-if="leftPlayers.length === 0" class="empty-team">
            <span class="empty-icon">👤</span>
            <span class="empty-text">Waiting for players...</span>
          </div>
        </div>
      </div>

      <!-- VS Divider -->
      <div class="vs-divider">
        <span class="vs-text">VS</span>
      </div>

      <!-- Right Team -->
      <div class="team-card right-team">
        <div class="team-header">
          <h4>Right Team</h4>
          <span class="player-count"
            >{{ rightPlayers.length }}
            {{ rightPlayers.length === 1 ? "Player" : "Players" }}</span
          >
        </div>

        <div class="players-list">
          <TransitionGroup name="player">
            <div
              v-for="player in rightPlayers"
              :key="player.id"
              class="player-card"
            >
              <div class="player-avatar" :style="{ background: player.color }">
                {{ getInitials(player.name) }}
              </div>
              <span class="player-name">{{ player.name }}</span>
              <div
                class="player-paddle"
                :style="{ background: player.color }"
              ></div>
            </div>
          </TransitionGroup>

          <div v-if="rightPlayers.length === 0" class="empty-team">
            <span class="empty-icon">👤</span>
            <span class="empty-text">Waiting for players...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
      <button
        @click="$emit('startGame')"
        :disabled="!canStart"
        class="btn-start"
      >
        <span class="btn-icon">🎮</span>
        <span>Start Game</span>
      </button>

      <button @click="$emit('goBack')" class="btn-back">
        <span class="btn-icon">←</span>
        <span>Leave</span>
      </button>
    </div>

    <!-- Game Info -->
    <div class="game-info">
      <div class="info-item">
        <span class="info-icon">🎯</span>
        <span class="info-text"
          >First to
          <strong>{{
            Math.max(1, Math.floor(players.length / 2) - 1) * 10
          }}</strong>
          wins</span
        >
      </div>
      <div class="info-item">
        <span class="info-icon">🎱</span>
        <span class="info-text"
          ><strong>{{
            Math.max(1, Math.floor(players.length / 2) - 1)
          }}</strong>
          {{
            Math.max(1, Math.floor(players.length / 2) - 1) === 1
              ? "ball"
              : "balls"
          }}</span
        >
      </div>
      <div class="info-item">
        <span class="info-icon">⌨️</span>
        <span class="info-text">Use <kbd>↑</kbd> <kbd>↓</kbd> to move</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WaitingRoom",
  props: {
    players: Array,
    canStart: Boolean,
    lastGameResults: Object,
  },
  computed: {
    leftPlayers() {
      return this.players.filter((p) => p.side === "left");
    },
    rightPlayers() {
      return this.players.filter((p) => p.side === "right");
    },
    mvp() {
      if (!this.lastGameResults || !this.lastGameResults.players) return null;

      const sorted = [...this.lastGameResults.players]
        .filter((p) => p.goals > 0)
        .sort((a, b) => b.goals - a.goals);

      return sorted[0] || null;
    },
  },
  methods: {
    getInitials(name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
  },
};
</script>

<style scoped>
.waiting-room {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
}

/* Connection Status */
.connection-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 10px var(--success);
  animation: pulse 2s ease-in-out infinite;
}

.status-text {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Results Banner */
.results-banner {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  text-align: center;
  animation: scaleIn 0.5s ease-out;
}

.results-banner.left-winner {
  border-color: var(--success);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
}

.results-banner.right-winner {
  border-color: var(--accent-primary);
  box-shadow: 0 0 30px rgba(0, 245, 255, 0.2);
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.trophy {
  font-size: 28px;
  animation: float 2s ease-in-out infinite;
}

.results-header h3 {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--text-primary);
  margin: 0;
}

.results-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}

.score {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
}

.score.left {
  color: var(--success);
}

.score.right {
  color: var(--accent-primary);
}

.score-divider {
  color: var(--text-muted);
  font-size: 32px;
}

.mvp-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--glass-border);
}

.mvp-badge {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  color: var(--bg-deep);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
}

.mvp-name {
  font-weight: 600;
  font-size: 16px;
}

.mvp-goals {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Status Section */
.status-section {
  text-align: center;
}

.status-waiting,
.status-ready {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.waiting-icon,
.ready-icon {
  font-size: 24px;
}

.status-waiting p,
.status-ready p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.status-ready {
  color: var(--success);
}

.status-ready .ready-icon {
  width: 36px;
  height: 36px;
  background: var(--success);
  color: var(--bg-deep);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  animation: pulseGlow 2s ease-in-out infinite;
  box-shadow: 0 0 20px var(--success);
}

.status-ready p {
  color: var(--success);
  font-weight: 600;
}

.waiting-dots {
  display: flex;
  gap: 6px;
}

.waiting-dots span {
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.waiting-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.waiting-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Teams Container */
.teams-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-md);
  align-items: start;
}

.team-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  min-height: 100px;
}

.left-team {
  border-left: 3px solid var(--success);
}

.right-team {
  border-right: 3px solid var(--accent-primary);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--glass-border);
}

.team-header h4 {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--text-primary);
  margin: 0;
}

.left-team .team-header h4 {
  color: var(--success);
}

.right-team .team-header h4 {
  color: var(--accent-primary);
}

.player-count {
  font-size: 12px;
  color: var(--text-muted);
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.player-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.player-card:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateX(4px);
}

.player-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--bg-deep);
  flex-shrink: 0;
}

.player-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
}

.player-paddle {
  width: 6px;
  height: 24px;
  border-radius: 3px;
  flex-shrink: 0;
}

.empty-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  color: var(--text-muted);
  gap: var(--space-sm);
}

.empty-icon {
  font-size: 32px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

/* Player Transition */
.player-enter-active {
  animation: fadeInUp 0.3s ease-out;
}

.player-leave-active {
  animation: fadeInUp 0.3s ease-out reverse;
}

/* VS Divider */
.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.vs-text {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 900;
  color: var(--text-muted);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

/* Actions */
.actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.btn-start,
.btn-back {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-start {
  background: linear-gradient(135deg, var(--success), #00cc6a);
  color: var(--bg-deep);
  box-shadow: var(--glow-success);
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
}

.btn-start:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-back {
  background: var(--glass-bg);
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
}

.btn-back:hover {
  background: rgba(255, 68, 68, 0.2);
  border-color: var(--danger);
  color: var(--danger);
}

.btn-icon {
  font-size: 18px;
}

/* Game Info */
.game-info {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  padding: var(--space-lg);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 14px;
  color: var(--text-secondary);
}

.info-icon {
  font-size: 16px;
}

.info-text strong {
  color: var(--accent-primary);
}

kbd {
  display: inline-block;
  padding: 2px 8px;
  font-family: var(--font-body);
  font-size: 11px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  margin: 0 2px;
}

/* Responsive styles for smaller screens */
@media (max-height: 800px) {
  .waiting-room {
    gap: var(--space-md);
  }

  .results-banner {
    padding: var(--space-md);
  }

  .trophy {
    font-size: 28px;
  }

  .results-header h3 {
    font-size: 18px;
  }

  .score {
    font-size: 36px;
  }

  .score-divider {
    font-size: 24px;
  }

  .status-section {
    padding: var(--space-sm) 0;
  }

  .waiting-icon,
  .ready-icon {
    font-size: 24px;
  }

  .status-ready .ready-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .team-card {
    padding: var(--space-md);
    min-height: 120px;
  }

  .team-header {
    margin-bottom: var(--space-sm);
    padding-bottom: var(--space-sm);
  }

  .player-card {
    padding: var(--space-sm);
  }

  .player-avatar {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

  .empty-team {
    padding: var(--space-md);
  }

  .empty-icon {
    font-size: 24px;
  }

  .actions {
    margin: var(--space-sm) 0;
  }

  .btn-start,
  .btn-back {
    padding: var(--space-sm) var(--space-lg);
    font-size: 12px;
  }

  .game-info {
    gap: var(--space-md);
    padding: var(--space-sm);
    flex-wrap: wrap;
  }

  .info-item {
    font-size: 12px;
  }
}

@media (max-height: 700px) {
  .waiting-room {
    gap: var(--space-sm);
  }

  .results-banner {
    padding: var(--space-sm);
  }

  .results-header {
    margin-bottom: var(--space-sm);
  }

  .results-score {
    margin-bottom: var(--space-sm);
  }

  .score {
    font-size: 28px;
  }

  .mvp-section {
    padding-top: var(--space-sm);
  }

  .teams-container {
    gap: var(--space-md);
  }

  .team-card {
    min-height: 80px;
  }
}

/* For narrower screens */
@media (max-width: 700px) {
  .teams-container {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .vs-divider {
    padding: var(--space-sm) 0;
  }

  .game-info {
    flex-direction: column;
    gap: var(--space-sm);
  }
}
</style>
