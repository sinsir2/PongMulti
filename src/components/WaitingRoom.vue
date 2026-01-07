<template>
  <div class="waiting-room">
    <h3>Waiting Room</h3>
    <p v-if="!canStart" class="status-message">Waiting for players on both sides...</p>
    <p v-else class="status-message ready">Ready to start!</p>

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
    canStart: Boolean
  },
  computed: {
    leftPlayers() {
      return this.players.filter(p => p.side === 'left');
    },
    rightPlayers() {
      return this.players.filter(p => p.side === 'right');
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
</style>
