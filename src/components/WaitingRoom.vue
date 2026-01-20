<template>
  <div class="waiting-room">
    <h3>Waiting Room</h3>
    <p v-if="!canStart" class="status-message">Waiting for players on both sides...</p>
    <p v-else class="status-message ready">Ready to start!</p>

    <!-- Last Game Results Section -->
    <div v-if="lastGameResults" class="last-game-results">
      <h4>Last Game Results</h4>
      <div class="winner-banner" :class="lastGameResults.winner + '-side'">
        <span class="trophy">🏆</span>
        {{ lastGameResults.winner === 'left' ? 'Left Side' : 'Right Side' }} Wins!
      </div>
      <div class="final-scores">
        <span class="score">{{ lastGameResults.leftScore }}</span>
        <span class="separator">:</span>
        <span class="score">{{ lastGameResults.rightScore }}</span>
      </div>
      <div v-if="topScorers.length > 0" class="top-scorers">
        <h5>Top Scorers</h5>
        <div v-for="(player, index) in topScorers" :key="player.id" class="scorer">
          <span class="rank">{{ index + 1 }}.</span>
          <span class="name" :style="{ color: player.color }">{{ player.name }}</span>
          <span class="goals">{{ player.goals }} goals</span>
        </div>
      </div>
    </div>

    <div class="teams">
      <div class="team">
        <h4>Left Side ({{ leftPlayers.length }})</h4>
        <ul>
          <li
            v-for="player in leftPlayers"
            :key="player.id"
            :style="{ color: player.color }"
          >
            {{ player.name }}
          </li>
        </ul>
      </div>

      <div class="team">
        <h4>Right Side ({{ rightPlayers.length }})</h4>
        <ul>
          <li
            v-for="player in rightPlayers"
            :key="player.id"
            :style="{ color: player.color }"
          >
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="actions">
      <button
        @click="$emit('startGame')"
        :disabled="!canStart"
        class="start-button"
      >
        Start Game
      </button>
      <button
        @click="$emit('goBack')"
        class="back-button"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaitingRoom',
  props: {
    players: Array,
    canStart: Boolean,
    lastGameResults: Object
  },
  computed: {
    leftPlayers() {
      return this.players.filter(p => p.side === 'left');
    },
    rightPlayers() {
      return this.players.filter(p => p.side === 'right');
    },
    topScorers() {
      if (!this.lastGameResults) return [];

      // Sort by goals descending, take top 3
      return this.lastGameResults.players
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 3)
        .filter(p => p.goals > 0);  // Only show players who scored
    }
  }
};
</script>

<style scoped>
.waiting-room {
  text-align: center;
  padding: 20px;
  color: #fff;
}

h3 {
  margin-bottom: 20px;
}

.status-message {
  font-size: 18px;
  margin-bottom: 30px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.status-message.ready {
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid #4CAF50;
}

.teams {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.team {
  flex: 1;
  max-width: 200px;
}

.team h4 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #444;
}

.team ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team li {
  padding: 8px;
  margin: 5px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  font-weight: bold;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.start-button {
  padding: 12px 30px;
  font-size: 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.start-button:hover:not(:disabled) {
  background: #45a049;
}

.start-button:disabled {
  background: #666;
  cursor: not-allowed;
}

.back-button {
  padding: 12px 30px;
  font-size: 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.back-button:hover {
  background: #da190b;
}

.last-game-results {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.last-game-results h4 {
  color: #fff;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 20px;
}

.winner-banner {
  font-size: 24px;
  font-weight: bold;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
}

.winner-banner.left-side {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
}

.winner-banner.right-side {
  background: linear-gradient(135deg, #2196f3, #42a5f5);
  color: white;
}

.trophy {
  font-size: 32px;
  margin-right: 10px;
}

.final-scores {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin: 15px 0;
  color: white;
}

.final-scores .score {
  color: white;
}

.final-scores .separator {
  margin: 0 20px;
  color: rgba(255, 255, 255, 0.5);
}

.top-scorers {
  margin-top: 20px;
}

.top-scorers h5 {
  color: white;
  margin-bottom: 10px;
  font-size: 18px;
  margin-top: 0;
}

.scorer {
  display: flex;
  align-items: center;
  padding: 8px;
  margin: 5px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
}

.scorer .rank {
  font-weight: bold;
  margin-right: 10px;
  color: #ffd700;
  min-width: 25px;
}

.scorer .name {
  flex: 1;
  font-weight: bold;
}

.scorer .goals {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
</style>
