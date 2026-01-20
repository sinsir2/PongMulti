<template>
  <div class="scoreboard-container" :class="{ collapsed: isCollapsed }">
    <!-- Toggle Button -->
    <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
      <span class="toggle-icon">{{ isCollapsed ? "◀" : "▶" }}</span>
      <span v-if="isCollapsed" class="toggle-label">Stats</span>
    </button>

    <!-- Scoreboard Panel -->
    <div class="scoreboard-panel">
      <div class="panel-header">
        <h3>Player Stats</h3>
      </div>

      <div class="teams-stats">
        <!-- Left Team -->
        <div class="team-section left-team">
          <div class="team-header">
            <span class="team-name">Left Team</span>
            <span class="team-score">{{ leftScore }}</span>
          </div>

          <div class="players-list">
            <div
              v-for="player in leftPlayers"
              :key="player.id"
              class="player-row"
            >
              <div class="player-info">
                <span
                  class="player-dot"
                  :style="{ background: player.color }"
                ></span>
                <span class="player-name">{{ player.name }}</span>
              </div>
              <div class="player-goals">
                <div class="goals-bar-container">
                  <div
                    class="goals-bar"
                    :style="{
                      width: getGoalPercentage(player.goals) + '%',
                      background: player.color,
                    }"
                  ></div>
                </div>
                <span class="goals-count">{{ player.goals }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="stats-divider"></div>

        <!-- Right Team -->
        <div class="team-section right-team">
          <div class="team-header">
            <span class="team-name">Right Team</span>
            <span class="team-score">{{ rightScore }}</span>
          </div>

          <div class="players-list">
            <div
              v-for="player in rightPlayers"
              :key="player.id"
              class="player-row"
            >
              <div class="player-info">
                <span
                  class="player-dot"
                  :style="{ background: player.color }"
                ></span>
                <span class="player-name">{{ player.name }}</span>
              </div>
              <div class="player-goals">
                <div class="goals-bar-container">
                  <div
                    class="goals-bar"
                    :style="{
                      width: getGoalPercentage(player.goals) + '%',
                      background: player.color,
                    }"
                  ></div>
                </div>
                <span class="goals-count">{{ player.goals }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Scoreboard",
  props: {
    players: Array,
    leftScore: Number,
    rightScore: Number,
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    leftPlayers() {
      return this.players.filter((p) => p.side === "left");
    },
    rightPlayers() {
      return this.players.filter((p) => p.side === "right");
    },
    maxGoals() {
      if (this.players.length === 0) return 1;
      return Math.max(1, ...this.players.map((p) => p.goals));
    },
  },
  methods: {
    getGoalPercentage(goals) {
      return (goals / this.maxGoals) * 100;
    },
  },
};
</script>

<style scoped>
.scoreboard-container {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 25;
  display: flex;
  align-items: center;
  transition: transform var(--transition-base);
}

.scoreboard-container.collapsed {
  transform: translateY(-50%) translateX(calc(100% - 40px));
}

/* Toggle Button */
.toggle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-right: none;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  color: var(--accent-primary);
}

.toggle-icon {
  font-size: 12px;
}

.toggle-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Panel */
.scoreboard-panel {
  width: 280px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-right: none;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--glass-border);
}

.panel-header h3 {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 0.05em;
}

/* Teams Stats */
.teams-stats {
  padding: 16px;
}

.team-section {
  margin-bottom: 16px;
}

.team-section:last-child {
  margin-bottom: 0;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--glass-border);
}

.team-name {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.left-team .team-name {
  color: var(--success);
}

.right-team .team-name {
  color: var(--accent-primary);
}

.team-score {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.stats-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 16px 0;
}

/* Players List */
.players-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.player-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px currentColor;
}

.player-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-goals {
  display: flex;
  align-items: center;
  gap: 8px;
}

.goals-bar-container {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.goals-bar {
  height: 100%;
  border-radius: 2px;
  transition: width var(--transition-base);
  box-shadow: 0 0 8px currentColor;
}

.goals-count {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 20px;
  text-align: right;
}
</style>
