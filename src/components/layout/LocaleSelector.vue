<template>
  <div class="locale-selector">
    <button 
      @click="toggleDropdown" 
      class="locale-button"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="locale-icon">{{ currentLocaleName }}</span>
      <ChevronDown :class="['chevron-icon', { 'rotate-180': isOpen }]" />
    </button>
    
    <div v-if="isOpen" class="locale-dropdown">
      <button 
        v-for="locale in availableLocales" 
        :key="locale.code"
        @click="changeLocale(locale.code)"
        :class="['locale-option', { 'active': locale.code === currentLocale }]"
      >
        {{ locale.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown } from 'lucide-vue-next'

const isOpen = ref(false)
const { locale, t } = useI18n()

const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' }
]

const currentLocale = computed(() => locale.value)

const currentLocaleName = computed(() => {
  const found = availableLocales.find(l => l.code === currentLocale.value)
  return found ? found.name : t('components.localeSelector.russian')
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const changeLocale = (localeCode) => {
  locale.value = localeCode
  localStorage.setItem('locale', localeCode)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const selector = document.querySelector('.locale-selector')
  if (selector && !selector.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.locale-selector {
  position: relative;
}

.locale-button {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #F3F4F6;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.locale-button:hover {
  background-color: #E5E7EB;
}

.locale-icon {
  display: inline-block;
  margin-right: 0.25rem;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}

.rotate-180 {
  transform: rotate(180deg);
}

.locale-dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  width: 10rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  overflow: hidden;
}

.locale-option {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
}

.locale-option:hover {
  background-color: #F3F4F6;
}

.locale-option.active {
  background-color: #F3F4F6;
  font-weight: 500;
  color: #3B82F6;
}
</style>
