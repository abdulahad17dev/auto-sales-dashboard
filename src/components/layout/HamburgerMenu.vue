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
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const toggleMenu = () => {
  emit('toggle')
  
  // Добавляем класс для предотвращения скролла при открытом меню на мобильных
  if (window.innerWidth <= 767) {
    if (!props.isOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }
}

// Отслеживаем изменения статуса меню
watch(() => props.isOpen, (isOpen) => {
  if (window.innerWidth <= 767) {
    if (isOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }
})

// Обработчик изменения размера экрана
const handleResize = () => {
  if (window.innerWidth > 767 && props.isOpen) {
    // Закрываем меню при переходе на десктоп
    emit('toggle')
  }
  
  // Убираем блокировку скролла при переходе на десктоп
  if (window.innerWidth > 767) {
    document.body.classList.remove('menu-open')
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.classList.remove('menu-open')
})
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
  z-index: 100;
  position: relative;
  outline: none;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: white;
  transition: transform 0.3s, opacity 0.3s;
  transform-origin: center;
  border-radius: 3px;
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

/* Enhanced mobile styles for better touch interaction */
@media (max-width: 767px) {
  .hamburger-menu {
    width: 1.5rem;
    height: 1.1rem;
    padding: 0.1rem;
  }
  
  .hamburger-line {
    height: 2px;
    border-radius: 4px;
    transition: transform 0.25s cubic-bezier(0.68, -0.6, 0.32, 1.6), opacity 0.25s;
  }
  
  .hamburger-line:nth-child(1) {
    width: 85%;
  }
  
  .hamburger-line:nth-child(2) {
    width: 100%;
  }
  
  .hamburger-line:nth-child(3) {
    width: 70%;
    margin-left: auto;
  }
  
  /* More pronounced active state */
  .hamburger-menu.is-active .hamburger-line:nth-child(1) {
    transform: translateY(0.4rem) rotate(45deg);
    width: 100%;
  }
  
  .hamburger-menu.is-active .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .hamburger-menu.is-active .hamburger-line:nth-child(3) {
    transform: translateY(-0.4rem) rotate(-45deg);
    width: 100%;
    margin-left: 0;
  }
}
</style>

<style>
/* Глобальные стили для предотвращения прокрутки при открытом мобильном меню */
body.menu-open {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
