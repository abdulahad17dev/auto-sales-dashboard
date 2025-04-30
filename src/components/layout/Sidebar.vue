<template>
  <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed && !isMobile }]">
    <div :class="['sidebar-header', { 'header-collapsed': isCollapsed && !isMobile }]">
      <div class="logo-container">
        <transition name="fade" mode="out-in">
          <span key="text" class="logo-text">{{ $t('appName') }}</span>
        </transition>
      </div>
      <!-- Only show collapse button on desktop, not on mobile -->
      <button v-if="!isMobile" @click="toggleSidebar" class="collapse-btn" :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <ChevronLeft v-if="!isCollapsed" class="icon" />
        <ChevronRight v-else class="icon" />
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <RouterLink 
        v-for="item in navItems" 
        :key="item.name"
        :to="item.path"
        :class="['nav-item', { active: isActive(item.path) }]"
      >
        <component :is="item.icon" class="nav-icon" />
        <span v-if="!isCollapsed || isMobile" class="nav-text">{{ $t(item.label) }}</span>
      </RouterLink>
    </nav>
    
    <div class="sidebar-footer">
      <RouterLink to="/settings" class="settings-btn">
        <Settings class="icon" />
        <span v-if="!isCollapsed || isMobile" class="settings-text">{{ $t('navigation.settings') }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BarChart2, Layers, Calendar, FileText, Users, MessageSquare, ChevronLeft, ChevronRight, Settings, TrendingUp } from 'lucide-vue-next'

const route = useRoute()
const { t } = useI18n()
const isCollapsed = ref(window.innerWidth <= 1279)
const isMobile = ref(window.innerWidth <= 767)

// Get first letter of app name for collapsed sidebar logo
const logoInitial = computed(() => {
  const appName = t('appName')
  return 'A'  // Всегда возвращать латинскую A вместо кириллической
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  
  // Emit event to parent component so it can adjust the content margin
  emit('collapse-change', isCollapsed.value)
}

// Make toggleSidebar and isCollapsed accessible to parent
defineExpose({ toggleSidebar, isCollapsed })

// Define emits
const emit = defineEmits(['collapse-change'])

const handleResize = () => {
  const width = window.innerWidth
  const wasMobile = isMobile.value
  isMobile.value = width <= 767
  
  // Handle transition between mobile and desktop
  if (wasMobile !== isMobile.value) {
    // When transitioning from mobile to desktop
    if (!isMobile.value) {
      // Apply desktop collapsing rules
      if (width <= 1279) {
        isCollapsed.value = true
      } else {
        isCollapsed.value = false
      }
    }
  } else if (!isMobile.value) {
    // Only apply auto-collapse when in desktop mode
    if (width > 767 && width <= 1279) {
      isCollapsed.value = true
    } else if (width > 1279) {
      isCollapsed.value = false
    }
  }
}

onMounted(() => {
  handleResize() // Initial check
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const isActive = (path) => {
  return route.path === path
}

const navItems = [
  { 
    name: 'salesByBrands', 
    path: '/brands', 
    label: 'navigation.salesByBrands',
    icon: BarChart2
  },
  { 
    name: 'salesByBrandsAndModels', 
    path: '/brands-models', 
    label: 'navigation.salesByBrandsAndModels',
    icon: Layers
  },
  { 
    name: 'salesByYears', 
    path: '/years', 
    label: 'navigation.salesByYears',
    icon: Calendar
  },
  { 
    name: 'marketAnalysis', 
    path: '/market-analysis', 
    label: 'navigation.marketAnalysis',
    icon: TrendingUp
  },
  { 
    name: 'orderDetails', 
    path: '/orders', 
    label: 'navigation.orderDetails',
    icon: FileText
  },
  { 
    name: 'contacts', 
    path: '/contacts', 
    label: 'navigation.contacts',
    icon: Users
  },
  { 
    name: 'feedbackStatus', 
    path: '/feedback', 
    label: 'navigation.feedbackStatus',
    icon: MessageSquare
  }
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 18rem;
  background-color: #1F2937;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 50;
}

.sidebar-collapsed {
  width: 4rem;
}

/* Стили для элементов в свернутом состоянии */
.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 0.5rem;
}

.sidebar-collapsed .nav-icon {
  margin: 0;
}

.sidebar-collapsed .settings-btn {
  justify-content: center;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 60px;
  overflow: hidden;
  background-color: #1a2433;
}

.sidebar-collapsed .sidebar-header {
  padding: 1rem 0.5rem;
  justify-content: center;
  min-height: 56px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  flex: 1;
  position: relative;
  width: 100%;
}

.sidebar-collapsed .logo-container {
  justify-content: center;
  width: auto;
  display: none;
}

/* Анимация перехода */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.logo-text {
  font-weight: 600;
  font-size: 1.25rem;
  white-space: nowrap;
  display: inline-block;
  width: 100%;
  color: white;
}

.logo-icon {
  font-weight: 600;
  font-size: 1.25rem;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3B82F6;
  border-radius: 0.375rem;
  flex-shrink: 0;
}



.sidebar-collapsed .logo-text {
  display: none;
}

.collapse-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Mobile specific styles for collapse button */
@media (max-width: 767px) {
  .collapse-btn {
    width: 2.5rem;
    height: 2.5rem;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 0.625rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .collapse-btn:active {
    background-color: rgba(255, 255, 255, 0.25);
    transform: scale(0.95);
  }
  
  .collapse-btn .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
}

.header-collapsed {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.sidebar-collapsed .collapse-btn {
  margin: 0.5rem 0;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s;
  font-weight: 500;
  height: 40px;
  overflow: hidden;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-item.active {
  background-color: #3B82F6;
  color: white;
}

.sidebar-collapsed .nav-item.active {
  border-radius: 0.375rem;
}

.nav-icon {
  width: 1.125rem;
  height: 1.125rem;
  min-width: 1.125rem;
  flex-shrink: 0;
  color: white;
}

.nav-text {
  margin-left: 0.75rem;
  white-space: normal;
  word-break: break-word;
  font-size: 0.8125rem;
  line-height: 1.1;
}

.sidebar-footer {
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 56px;
}

.settings-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  border: none;
  background-color: rgba(59, 130, 246, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-weight: 500;
  height: 36px;
}

.settings-btn:hover {
  background-color: rgba(59, 130, 246, 0.3);
  color: white;
}

.settings-text {
  margin-left: 0.75rem;
  white-space: nowrap;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  color: white;
}

.collapse-btn .icon {
  color: white;
}

.settings-btn .icon {
  color: white;
}

/* Стили для иконок в свернутом меню */
.sidebar-collapsed .collapse-btn,
.sidebar-collapsed .settings-btn {
  width: 36px;
  height: 36px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-collapsed .sidebar-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive styles */
@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-100%);
    width: 18rem;
    transition: transform 0.3s ease;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }
  
  .sidebar.sidebar-collapsed {
    transform: translateX(-100%);
    width: 18rem; /* Keep same width when collapsed on mobile */
  }
  
  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  /* Make navigation text more visible on mobile */
  .nav-text, .settings-text {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
    font-size: 0.9375rem;
    margin-left: 1rem;
    display: block !important;
  }
  
  /* Improve spacing for mobile nav items */
  .nav-item {
    padding: 0.75rem 1rem;
    height: auto;
    min-height: 48px; /* Better touch target */
  }
  
  /* Improve spacing for settings button */
  .settings-btn {
    height: auto;
    min-height: 42px;
    padding: 0.75rem 1rem;
  }
  
  /* Mobile specific sidebar header */
  .sidebar-header {
    height: auto;
    min-height: 56px;
    padding: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center; /* Center since there's no close button */
    background-color: #1a2433; /* Darker blue for better contrast */
  }
  
  /* Mobile specific logo text style */
  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    text-align: center;
    display: block !important;
    width: 100%;
  }
  
  /* Make logo container full width on mobile since no button */
  .logo-container {
    display: flex !important;
    justify-content: center;
    width: 100%;
    margin: 0;
  }
}
</style>
