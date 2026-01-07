<template>
  <div class="login-screen">
    <h3>Join Game</h3>
    <input
      v-model="name"
      placeholder="Enter your name"
      @keyup.enter="join"
      class="name-input"
    />
    <div class="color-picker">
      <label>Paddle Color:</label>
      <input type="color" v-model="color" />
    </div>
    <button @click="join" :disabled="!name" class="join-button">Join</button>
  </div>
</template>

<script>
export default {
  name: 'LoginScreen',
  data() {
    return {
      name: '',
      color: '#ffffff'
    };
  },
  methods: {
    join() {
      if (this.name) {
        this.$emit('join', { name: this.name, color: this.color });
      }
    }
  }
};
</script>

<style scoped>
.login-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
}

h3 {
  margin: 0;
  color: #fff;
}

.name-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #333;
  border-radius: 5px;
  background: #222;
  color: #fff;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.color-picker label {
  color: #fff;
}

.color-picker input[type="color"] {
  width: 60px;
  height: 40px;
  border: none;
  cursor: pointer;
}

.join-button {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.join-button:hover:not(:disabled) {
  background: #45a049;
}

.join-button:disabled {
  background: #666;
  cursor: not-allowed;
}
</style>
