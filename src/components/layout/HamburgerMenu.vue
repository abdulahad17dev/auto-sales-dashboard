<template>
  <button 
    :class="['hamburger-menu', { 'is-active': isOpen }]" 
    @click="toggleMenu"
    aria-label="Toggle menu"
  >
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const toggleMenu = () => {
  emit('toggle')
}
</script>

<style scoped>
.hamburger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1.75rem;
  height: 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  position: relative;
  outline: none; /* Remove outline on focus */
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transition: transform 0.3s, opacity 0.3s;
  transform-origin: center;
  border-radius: 1px; /* Smoother lines */
}

.hamburger-menu.is-active .hamburger-line:nth-child(1) {
  transform: translateY(0.5rem) rotate(45deg);
}

.hamburger-menu.is-active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.is-active .hamburger-line:nth-child(3) {
  transform: translateY(-0.5rem) rotate(-45deg);
}
</style>
