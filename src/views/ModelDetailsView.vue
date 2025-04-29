<template>
  <div class="model-details-view">
    <div class="page-header">
      <div class="header-left">
        <button @click="goBack" class="back-button">
          <ArrowLeft class="icon" />
          {{ $t('modelDetails.back') }}
        </button>
        <h1>{{ $t('modelDetails.title') }}</h1>
      </div>
      <div class="header-controls">
        <Select
          v-model="selectedModel"
          :options="modelOptions"
          :label="$t('salesByBrandsAndModels.model')"
          class="model-select"
        />
      </div>
    </div>
    
    <div class="model-container">
      <ModelDetails :model-id="selectedModel" :loading="loading" />
    </div>
    
    <div class="related-models">
      <h2>{{ $t('modelDetails.relatedModels') }}</h2>
      <div class="models-grid">
        <div 
          v-for="model in relatedModels" 
          :key="model.id"
          class="model-card"
          @click="viewModel(model.id)"
        >
          <div class="model-image">
            <div class="model-placeholder"></div>
          </div>
          <div class="model-info">
            <div class="model-brand">{{ model.brand }}</div>
            <div class="model-name">{{ model.name }}</div>
            <div class="model-meta">
              <div class="model-year">{{ model.year }}</div>
              <div class="model-type">{{ model.type }}</div>
            </div>
          </div>
          <div class="model-data">
            <div class="data-item">
              <div class="data-label">{{ $t('modelDetails.localization') }}</div>
              <div class="data-value">{{ model.localizationProgress }}%</div>
              </div>
              <div class="data-item">
              <div class="data-label">{{ $t('modelDetails.sales') }}</div>
              <div class="data-value">{{ formatNumber(model.sales) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'
import Select from '@/components/ui/Select.vue'
import ModelDetails from '@/components/ui/ModelDetails.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const loading = ref(true)
const selectedModel = ref('1')

// Options for model select
const modelOptions = [
  { value: '1', label: 'BYD Han' },
  { value: '2', label: 'BYD Tang' },
  { value: '3', label: 'Chery Tiggo 7 Pro' },
  { value: '4', label: 'Geely Coolray' },
  { value: '5', label: 'AITO M5' },
  { value: '6', label: 'Great Wall Poer' }
]

const relatedModels = computed(() => [
  { 
    id: '2', 
    brand: 'BYD', 
    name: 'Tang', 
    year: '2025', 
    type: t('modelDetails.vehicleTypes.suv'),
    localizationProgress: 65,
    sales: 9820
  },
  { 
    id: '7', 
    brand: 'BYD', 
    name: 'Seal', 
    year: '2025', 
    type: t('modelDetails.vehicleTypes.sedan'),
    localizationProgress: 58,
    sales: 8450
  },
  { 
    id: '5', 
    brand: 'AITO', 
    name: 'M5', 
    year: '2024', 
    type: t('modelDetails.vehicleTypes.suv'),
    localizationProgress: 72,
    sales: 7620
  },
  { 
    id: '8', 
    brand: 'BYD', 
    name: 'Song Plus', 
    year: '2024', 
    type: t('modelDetails.vehicleTypes.suv'),
    localizationProgress: 80,
    sales: 10250
  }
])

// Watch for route query param changes
watch(() => route.query.id, (newId) => {
  if (newId) {
    selectedModel.value = newId
  }
}, { immediate: true })

// Watch for selected model changes
watch(selectedModel, () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
  
  // Update URL without reloading
  router.replace({
    query: { ...route.query, id: selectedModel.value }
  })
})

// Methods
const goBack = () => {
  router.go(-1)
}

const viewModel = (modelId) => {
  selectedModel.value = modelId
}

// Helpers
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Initialize
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.model-details-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #F3F4F6;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #E5E7EB;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.model-select {
  width: 250px;
}

.model-container {
  min-height: 600px;
}

.related-models {
  margin-top: 1rem;
}

.related-models h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.model-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.model-image {
  position: relative;
  height: 160px;
  background-color: #F9FAFB;
}

.model-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #F3F4F6 25%, #E5E7EB 25%, #E5E7EB 50%, #F3F4F6 50%, #F3F4F6 75%, #E5E7EB 75%);
  background-size: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-info {
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.model-brand {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.model-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.model-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6B7280;
}

.model-data {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

.data-item {
  text-align: center;
}

.data-label {
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.data-value {
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-controls {
    width: 100%;
  }
  
  .model-select {
    width: 100%;
  }
}
</style>
