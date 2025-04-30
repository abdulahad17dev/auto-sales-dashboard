  /* Adjust breadcrumbs for mobile */
  .breadcrumbs-container {
    max-width: calc(100vw - 180px); /* Make room for mobile buttons */
  }<template>
  <div class="app-container">
    <Sidebar 
      ref="sidebar" 
      @collapse-change="handleSidebarCollapseChange" 
      :style="{ 'transform': isMobile && isMenuCollapsed ? 'translateX(-100%)' : 'translateX(0)' }"
    />
    <div class="content-container" :class="{ 
      'sidebar-collapsed': isSidebarCollapsed && !isMobile
    }">
      <div v-if="isMobile" class="mobile-menu-btn" :class="{ 'is-open': !isMenuCollapsed }">
        <HamburgerMenu :is-open="!isMenuCollapsed" @toggle="toggleSidebar" />
      </div>
      <header class="app-header" :data-title="$t('appName')">
        <div class="header-left">
          <button v-if="canGoBack" @click="goBack" class="back-button" aria-label="Go back">
            <ArrowLeft class="icon" />
          </button>
          <Breadcrumbs class="breadcrumbs-container" />
        </div>
        <div class="header-right">
          <LocaleSelector />
          <button class="notification-button" aria-label="Notifications">
            <Bell class="icon" />
            <span v-if="hasNotifications" class="notification-badge"></span>
          </button>
        </div>
      </header>
      <main>
        <RouterView />
      </main>
      <div v-if="isMobile" class="mobile-overlay" :class="{ 'active': !isMenuCollapsed }" @click="closeMobileMenu"></div>
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
const hasNotifications = ref(true) // Demo for notification badge

const canGoBack = computed(() => {
  return route.meta.allowBack !== false
})

const goBack = () => {
  router.back()
}

const handleResize = () => {
  const oldIsMobile = isMobile.value
  isMobile.value = window.innerWidth <= 767
  
  // Close mobile menu when switching from mobile to desktop
  if (oldIsMobile && !isMobile.value) {
    isMenuCollapsed.value = true
  }
  
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
}

const toggleSidebar = () => {
  if (sidebar.value) {
    if (isMobile.value) {
      // On mobile, we just toggle the menu visibility state without calling sidebar.toggleSidebar
      isMenuCollapsed.value = !isMenuCollapsed.value
      // Control body scroll
      document.body.style.overflow = isMenuCollapsed.value ? 'auto' : 'hidden';
    } else {
      // On desktop, use the regular sidebar toggle logic
      sidebar.value.toggleSidebar()
      // Note: isSidebarCollapsed will be updated via the collapse-change event
    }
  }
}

// Close mobile menu when clicking on overlay
const closeMobileMenu = () => {
  if (!isMenuCollapsed.value) {
    toggleSidebar();
  }
}

// Handle sidebar collapse change
const handleSidebarCollapseChange = (isCollapsed) => {
  isSidebarCollapsed.value = isCollapsed;
}

// Close mobile menu when route changes
watch(route, () => {
  if (isMobile.value && !isMenuCollapsed.value) {
    toggleSidebar();
  }
});

// Set initial sidebar collapsed state and DOM ready
onMounted(() => {
  // Initial body state
  document.body.classList.add('mobile-ready');
  
  // Wait for sidebar component to be available
  setTimeout(() => {
    if (sidebar.value && sidebar.value.isCollapsed !== undefined) {
      isSidebarCollapsed.value = sidebar.value.isCollapsed;
    }
  }, 100);
  
  handleResize(); // Initial check
  window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.body.classList.remove('mobile-ready');
  document.body.style.overflow = 'auto'; // Restore scroll if needed
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
  transition: margin-left 0.3s ease, transform 0.3s ease;
  width: calc(100% - 18rem);
  position: relative;
}

.content-container.sidebar-collapsed {
  margin-left: 4rem;
  width: calc(100% - 4rem);
}

/* Специальные стили для принудительного сброса отступов на мобильных */
@media (max-width: 767px) {
  .content-container {
    margin-left: 0 !important;
    width: 100% !important;
    padding-left: 0 !important;
  }
  
  .content-container.sidebar-collapsed {
    margin-left: 0 !important;
    width: 100% !important;
  }
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.5rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.breadcrumbs-container {
  max-width: calc(100vw - 150px);
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.breadcrumbs-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.back-button, .notification-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background-color: #F3F4F6;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button:hover, .notification-button:hover {
  background-color: #E5E7EB;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.back-button:active, .notification-button:active {
  transform: translateY(1px);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
}

.notification-button {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.625rem;
  height: 0.625rem;
  background-color: #EF4444;
  border-radius: 50%;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #1F2937;
}

main {
  padding: 1.5rem;
  min-height: calc(100vh - 70px);
  margin-top: 70px; /* Add margin to account for fixed header */
}

/* Mobile menu button */
.mobile-menu-btn {
  position: fixed;
  top: 0.65rem;
  left: 0.65rem;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: #3B82F6;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-btn.is-open {
  left: 0.65rem; /* Keep position the same */
  background: #2563EB;
}

.mobile-menu-btn:active {
  transform: scale(0.92);
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
}

/* Mobile overlay for when sidebar is open */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45; /* Just below sidebar but above other content */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* Mobile ready body state */
body.mobile-ready {
  -webkit-tap-highlight-color: transparent;
}

/* Responsive adjustments for mobile */
@media (max-width: 767px) {
  .content-container {
    margin-left: 0 !important;
    width: 100% !important;
    padding-left: 0; /* Remove left padding */
    transition: none; /* Disable transition on mobile */
  }
      
  .sidebar {
    /* Ensure overlay behavior */
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 100;
    width: 18rem !important; /* Force full width sidebar on mobile */
  }
  
  /* No transform needed as we're handling it inline */
  .content-container.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }
  
  .app-header {
    padding: 0.75rem 0.75rem 0.75rem 3.25rem;
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    height: 56px;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
  }
  
  /* Remove app title from mobile header */
  .app-header::before {
    content: none;
  }
  
  main {
    padding: 1rem;
    margin-top: 56px; /* Account for fixed header height */
  }
  
  /* Adjust header right for mobile */
  .header-right {
    display: flex;
    align-items: center;
    gap: 0.375rem; /* Reduce gap between buttons */
    margin-left: auto; /* Push to right */
    padding-left: 0.5rem; /* Add some space from breadcrumbs */
  }
  
  /* Adjust breadcrumbs for mobile */
  .breadcrumbs-container {
    max-width: calc(100vw - 140px); /* Make room for mobile buttons */
    white-space: nowrap;
    overflow-x: auto;
    text-overflow: ellipsis;
  }
  
  .back-button, .notification-button {
    width: 2rem;
    height: 2rem;
    border-radius: 0.75rem;
    background-color: #F0F4FF;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.12);
  }
  
  .notification-button {
    margin-left: 0.5rem;
  }
  
  .notification-badge {
    width: 0.75rem;
    height: 0.75rem;
    right: 0.45rem;
    top: 0.45rem;
    box-shadow: 0 0 0 2px #ffffff;
  }
  
  /* Улучшаем отображение меню-гамбургера */
  .mobile-menu-btn {
    z-index: 100; /* Выше чем сайдбар */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}

/* Prevent scroll when menu is open */
body.no-scroll {
  overflow: hidden;
}

/* Tablet responsive adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-header {
    padding: 0.75rem 1rem;
  }
  
  main {
    padding: 1rem;
  }
}

/* Landscape orientation for mobile */
@media (max-width: 767px) and (orientation: landscape) {
  .app-header {
    padding: 0.5rem 1rem 0.5rem 4rem;
  }
  
  main {
    padding: 0.75rem;
  }
  
  .mobile-menu-btn {
    top: 0.5rem;
    left: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
