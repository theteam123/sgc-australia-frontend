<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen }">
    <div class="loading-spinner">
      <div class="spinner-circle"></div>
      <div class="spinner-circle"></div>
      <div class="spinner-circle"></div>
    </div>
    <div v-if="message" class="loading-message">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fullscreen?: boolean;
  message?: string;
}

defineProps<Props>();
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(245, 246, 248, 0.9);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

.spinner-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-green);
  animation: wave 1.4s infinite ease-in-out;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-circle:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner-circle:nth-child(3) {
  animation-delay: 0s;
}

@keyframes wave {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.loading-message {
  color: var(--monday-medium-dark);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>