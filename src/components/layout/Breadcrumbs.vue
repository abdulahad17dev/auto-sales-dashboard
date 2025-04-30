<template>
  <div class="breadcrumbs" v-if="breadcrumbs.length > 0">
    <div 
      v-for="(crumb, index) in breadcrumbs" 
      :key="index" 
      class="breadcrumb-item"
    >
      <RouterLink 
        v-if="index < breadcrumbs.length - 1" 
        :to="crumb.path" 
        class="breadcrumb-link"
      >
        {{ crumb.name }}
      </RouterLink>
      <span v-else class="breadcrumb-current">
        {{ crumb.name }}
      </span>
      
      <ChevronRight v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isMobile = ref(window.innerWidth <= 767)

// Watch for window resize to update mobile status
const handleResize = () => {
  isMobile.value = window.innerWidth <= 767
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const breadcrumbs = computed(() => {
  const matched = route.matched.map(record => {
    // Use titleKey for localization if available
    let name = record.name
    if (record.meta.titleKey) {
      name = t(record.meta.titleKey)
    } else if (record.meta.title) {
      name = record.meta.title
    }
    
    // Truncate long titles for mobile
    if (isMobile.value && name && name.length > 20) {
      name = name.substring(0, 20) + '...'
    }
    
    return {
      name: name,
      path: record.path
    }
  }).filter(item => item.name)
  
  // If we have route params, add them to the breadcrumb
  if (route.params && Object.keys(route.params).length > 0) {
    // For example, if you have a route like /brands/:brand
    if (route.params.brand) {
      matched.push({
        name: route.params.brand,
        path: route.path
      })
    }
    
    // For models or other specific params
    if (route.params.model) {
      matched.push({
        name: route.params.model,
        path: route.path
      })
    }
  }
  
  return matched
})
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #6B7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #1F2937;
  text-decoration: underline;
}

.breadcrumb-current {
  color: #1F2937;
  font-weight: 500;
}

.breadcrumb-separator {
  width: 1rem;
  height: 1rem;
  color: #9CA3AF;
  margin: 0 0.25rem;
}

@media (max-width: 767px) {
  .breadcrumbs {
    font-size: 0.75rem;
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
    padding-right: 1rem;
  }
}
</style>
