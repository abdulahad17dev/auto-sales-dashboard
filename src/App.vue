<template>
  <div class="app-container">
    <Sidebar 
      ref="sidebar" 
      @collapse-change="handleSidebarCollapseChange" 
    />
    <div class="content-container" :class="{ 
      'mobile-open': isMobile && !isMenuCollapsed,
      'sidebar-collapsed': isSidebarCollapsed 
    }">
      <div v-if="isMobile" class="mobile-menu-btn">
        <HamburgerMenu :is-open="!isMenuCollapsed" @toggle="toggleSidebar" />
      </div>
      <header class="app-header">
        <div class="header-left">
          <button v-if="canGoBack" @click="goBack" class="back-button" aria-label="Go back">
            <ArrowLeft class="icon" />
          </button>
          <Breadcrumbs />
        </div>
        <div class="header-right">
          <LocaleSelector />
          <button class="notification-button" aria-label="Notifications">
            <Bell class="icon" />
          </button>
        </div>
      </header>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Bell, Menu } from 'lucide-vue-next'
import Sidebar from './components/layout/Sidebar.vue'
import Breadcrumbs from './components/layout/Breadcrumbs.vue'
import LocaleSelector from './components/layout/LocaleSelector.vue'
import HamburgerMenu from './components/layout/HamburgerMenu.vue'

const router = useRouter()
const route = useRoute()
const sidebar = ref(null)
const isMobile = ref(window.innerWidth <= 767)
const isMenuCollapsed = ref(true)
const isSidebarCollapsed = ref(window.innerWidth <= 1279)

const canGoBack = computed(() => {
  return route.meta.allowBack !== false
})

const goBack = () => {
  router.back()
}

const handleResize = () => {
  isMobile.value = window.innerWidth <= 767
  
  // Auto-collapse on desktop medium screens
  if (window.innerWidth > 767 && window.innerWidth <= 1279) {
    isSidebarCollapsed.value = true
  } else if (window.innerWidth > 1279) {
    isSidebarCollapsed.value = false
  }
  
  // Update sidebar's internal state if it's already available
  if (sidebar.value && sidebar.value.isCollapsed !== undefined) {
    // Synchronize sidebar internal state with our state
    sidebar.value.isCollapsed = isSidebarCollapsed.value;
  }
  
  console.log('Window resized, sidebar collapsed:', isSidebarCollapsed.value);
}

const toggleSidebar = () => {
  if (sidebar.value) {
    sidebar.value.toggleSidebar()
    isMenuCollapsed.value = !isMenuCollapsed.value
    // Note: isSidebarCollapsed will be updated via the collapse-change event
  }
}

// Handle sidebar collapse change
const handleSidebarCollapseChange = (isCollapsed) => {
  isSidebarCollapsed.value = isCollapsed;
  console.log('Sidebar collapsed state changed:', isCollapsed);
}

// Set initial sidebar collapsed state
onMounted(() => {
  // Wait for sidebar component to be available
  setTimeout(() => {
    if (sidebar.value && sidebar.value.isCollapsed !== undefined) {
      isSidebarCollapsed.value = sidebar.value.isCollapsed;
      console.log('Initial sidebar state:', isSidebarCollapsed.value);
    }
  }, 100);
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.content-container {
  flex: 1;
  margin-left: 18rem;
  transition: margin-left 0.3s ease;
  width: calc(100% - 18rem);
}

.content-container.sidebar-collapsed {
  margin-left: 4rem;
  width: calc(100% - 4rem);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button, .notification-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: #F3F4F6;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover, .notification-button:hover {
  background-color: #E5E7EB;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #1F2937;
}

main {
  padding: 1.5rem;
}

/* Mobile menu button */
.mobile-menu-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments for mobile */
@media (max-width: 767px) {
  .content-container {
    margin-left: 0;
    padding-top: 1rem;
  }
  
  .content-container.mobile-open {
    transform: translateX(18rem);
  }
  
  .app-header {
    padding: 0.75rem 1rem 0.75rem 4rem;
  }
  
  main {
    padding: 1rem;
  }
}
</style>
