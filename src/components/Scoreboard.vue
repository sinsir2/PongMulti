<template>
  <div class="scoreboard">
    <h3>Individual Stats</h3>
    <div class="teams">
      <div class="team">
        <h4>Left Side: {{ leftScore }}</h4>
        <table>
          <tr v-for="player in leftPlayers" :key="player.id">
            <td :style="{ color: player.color }">{{ player.name }}</td>
            <td>{{ player.goals }} goals</td>
          </tr>
        </table>
      </div>

      <div class="team">
        <h4>Right Side: {{ rightScore }}</h4>
        <table>
          <tr v-for="player in rightPlayers" :key="player.id">
            <td :style="{ color: player.color }">{{ player.name }}</td>
            <td>{{ player.goals }} goals</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scoreboard',
  props: {
    players: Array,
    leftScore: Number,
    rightScore: Number
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
.scoreboard {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #fff;
}

h3 {
  margin: 0 0 20px 0;
  text-align: center;
}

.teams {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.team {
  flex: 1;
  max-width: 300px;
}

.team h4 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #444;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid #333;
}

td {
  padding: 8px;
  text-align: left;
}

td:first-child {
  font-weight: bold;
}

td:last-child {
  text-align: right;
  color: #aaa;
}
</style>
