<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Card Header -->
      <div class="card-header">
        <div class="header-icon">👤</div>
        <h3>Join the Game</h3>
        <p class="header-subtitle">Enter your details to play</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="join" class="login-form">
        <!-- Name Input -->
        <div class="input-group">
          <label for="player-name" class="input-label">Player Name</label>
          <div class="input-wrapper">
            <span class="input-icon">✏️</span>
            <input
              id="player-name"
              v-model="name"
              type="text"
              placeholder="Enter your name..."
              class="text-input"
              autocomplete="off"
              maxlength="20"
            />
          </div>
        </div>

        <!-- Color Picker -->
        <div class="input-group">
          <label class="input-label">Paddle Color</label>
          <div class="color-picker-wrapper">
            <div class="color-presets">
              <button
                v-for="preset in colorPresets"
                :key="preset"
                type="button"
                class="color-preset"
                :class="{ active: color === preset }"
                :style="{ background: preset }"
                @click="color = preset"
              >
                <span v-if="color === preset" class="check-mark">✓</span>
              </button>
            </div>
            <div class="custom-color">
              <label class="custom-color-label">
                <input
                  type="color"
                  v-model="color"
                  class="color-input-hidden"
                />
                <span class="custom-color-btn" :style="{ background: color }">
                  <span class="custom-text">Custom</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="paddle-preview">
          <span class="preview-label">Your Paddle</span>
          <div class="preview-paddle" :style="{ background: color }"></div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="!name.trim()" class="join-btn">
          <span class="btn-text">Enter Arena</span>
          <span class="btn-icon">→</span>
        </button>

        <!-- Hint -->
        <p class="keyboard-hint"><kbd>Enter</kbd> to join quickly</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginScreen",
  data() {
    return {
      name: "",
      color: "#00f5ff",
      colorPresets: [
        "#00f5ff", // Cyan
        "#ff00ff", // Magenta
        "#00ff88", // Green
        "#ffaa00", // Orange
        "#ff4444", // Red
        "#7b2fff", // Purple
        "#ffffff", // White
        "#ffff00", // Yellow
      ],
    };
  },
  methods: {
    join() {
      if (this.name.trim()) {
        this.$emit("join", { name: this.name.trim(), color: this.color });
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.login-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-elevated);
  transition: all var(--transition-base);
}

.login-card:hover {
  border-color: var(--glass-border-hover);
  box-shadow:
    var(--shadow-elevated),
    0 0 40px rgba(0, 245, 255, 0.1);
}

/* Card Header */
.card-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.header-icon {
  font-size: 48px;
  margin-bottom: var(--space-md);
  animation: float 3s ease-in-out infinite;
}

.card-header h3 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs);
  letter-spacing: 0.02em;
}

.header-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* Input Group */
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.input-label {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--space-md);
  font-size: 16px;
  pointer-events: none;
}

.text-input {
  width: 100%;
  padding: var(--space-md) var(--space-md) var(--space-md) 48px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: all var(--transition-base);
}

.text-input::placeholder {
  color: var(--text-muted);
}

.text-input:focus {
  border-color: var(--accent-primary);
  box-shadow:
    0 0 0 3px rgba(0, 245, 255, 0.15),
    0 0 20px rgba(0, 245, 255, 0.2);
  background: rgba(0, 0, 0, 0.4);
}

/* Color Picker */
.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.color-presets {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.color-preset {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-preset:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px currentColor;
}

.color-preset.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 20px currentColor;
  transform: scale(1.1);
}

.check-mark {
  color: var(--bg-deep);
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.custom-color {
  display: flex;
  align-items: center;
}

.custom-color-label {
  cursor: pointer;
}

.color-input-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-color-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-base);
}

.custom-color-btn:hover {
  border-color: var(--accent-primary);
}

.custom-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--bg-deep);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* Paddle Preview */
.paddle-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
}

.preview-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.preview-paddle {
  width: 12px;
  height: 60px;
  border-radius: 4px;
  box-shadow: 0 0 15px currentColor;
  transition: all var(--transition-base);
}

/* Join Button */
.join-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  width: 100%;
  padding: var(--space-lg) var(--space-xl);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bg-deep);
  background: linear-gradient(
    135deg,
    var(--accent-primary),
    var(--accent-tertiary)
  );
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.join-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.join-btn:hover:not(:disabled)::before {
  left: 100%;
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 0 30px rgba(0, 245, 255, 0.5),
    0 10px 40px rgba(0, 245, 255, 0.3);
}

.join-btn:active:not(:disabled) {
  transform: translateY(0);
}

.join-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--glass-bg);
  color: var(--text-muted);
}

.btn-icon {
  font-size: 20px;
  transition: transform var(--transition-base);
}

.join-btn:hover:not(:disabled) .btn-icon {
  transform: translateX(4px);
}

/* Keyboard Hint */
.keyboard-hint {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

kbd {
  display: inline-block;
  padding: 2px 8px;
  font-family: var(--font-body);
  font-size: 11px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  margin-right: 4px;
}
</style>
