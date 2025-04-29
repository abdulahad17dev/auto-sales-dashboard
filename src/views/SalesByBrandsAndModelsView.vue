<template>
  <div class="sales-by-brands-models">
    <div class="page-header">
      <h1>{{ $t('salesByBrandsAndModels.title') }}</h1>
      <div class="header-controls">
        <button 
          @click="toggleModels" 
          class="toggle-btn"
        >
          <template v-if="showAllModels">
            <FolderMinus class="icon" />
            {{ $t('salesByBrandsAndModels.collapseModels') }}
          </template>
          <template v-else>
            <FolderPlus class="icon" />
            {{ $t('salesByBrandsAndModels.expandModels') }}
          </template>
        </button>
      </div>
    </div>
    
    <div class="brand-filter">
      <div class="selected-brand">
        <span class="filter-label">{{ $t('salesByBrandsAndModels.brandLabel') }}</span>
        <span 
          v-if="selectedBrand" 
          class="brand-badge"
        >
          {{ selectedBrand }} <X class="remove-icon" @click="clearBrandFilter" />
        </span>
        <span v-else>{{ $t('salesByBrandsAndModels.allBrands') }}</span>
      </div>
    </div>
    
    <div class="heatmap-container">
      <div v-if="loading" class="heatmap-loading">
        <div class="loading-spinner"></div>
      </div>
      <v-chart v-else :option="heatmapOption" autoresize />
    </div>
    
    <div class="models-section">
      <div
        v-for="brand in filteredBrandsData"
        :key="brand.name"
        class="brand-card"
      >
        <div class="brand-header" @click="toggleBrand(brand)">
          <h3 class="brand-name">{{ brand.name }}</h3>
          <ChevronDown 
            :class="['toggle-icon', { 'rotated': expandedBrands.includes(brand.name) }]" 
          />
        </div>
        
        <div v-if="expandedBrands.includes(brand.name) || showAllModels" class="models-table">
          <Table
            :columns="modelsColumns"
            :data="brand.models"
            clickable
            @row-click="handleModelClick"
          >
            <template #cell-sales="{ value }">
              <div class="sales-progress">
                <div 
                  class="progress-bar" 
                  :style="{ width: `${(value / maxSales) * 100}%` }"
                ></div>
                <span class="progress-text">{{ value }}</span>
              </div>
            </template>
            <template #cell-actions="{ row }">
              <button 
                @click.stop="showDetails(brand.name, row)"
                class="details-btn"
              >
                {{ $t('salesByBrandsAndModels.details') }}
              </button>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { HeatmapChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent, CalendarComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ChevronDown, FolderPlus, FolderMinus, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Table from '@/components/ui/Table.vue'

// Register ECharts components
use([
  CanvasRenderer,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent
])

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const loading = ref(true)
const selectedBrand = ref('')
const expandedBrands = ref([])
const showAllModels = ref(false)

// Set selected brand from query param
watch(() => route.query.brand, (newBrand) => {
  if (newBrand) {
    selectedBrand.value = newBrand
    expandedBrands.value = [newBrand]
  }
}, { immediate: true })

const modelsColumns = computed(() => [
  { key: 'name', label: t('salesByBrandsAndModels.model'), sortable: true },
  { key: 'sales', label: t('salesByBrandsAndModels.sales'), sortable: true },
  { key: 'revenue', label: t('salesByBrandsAndModels.revenue') + ', $', sortable: true },
  { key: 'actions', label: t('orderDetails.actions') }
])

// Mock data for brands and models
const brandsData = ref([
  {
    name: 'BYD',
    models: [
      { id: 1, name: 'Han', sales: 520, revenue: 1300000 },
      { id: 2, name: 'Tang', sales: 480, revenue: 1150000 },
      { id: 3, name: 'Song Plus', sales: 450, revenue: 900000 },
      { id: 4, name: 'Seal', sales: 380, revenue: 950000 },
      { id: 5, name: 'Dolphin', sales: 350, revenue: 700000 },
      { id: 6, name: 'Atto 3', sales: 320, revenue: 640000 }
    ]
  },
  {
    name: 'AITO',
    models: [
      { id: 7, name: 'M5', sales: 340, revenue: 850000 },
      { id: 8, name: 'M7', sales: 280, revenue: 840000 },
      { id: 9, name: 'M9', sales: 220, revenue: 660000 }
    ]
  },
  {
    name: 'Avatr',
    models: [
      { id: 10, name: '11', sales: 210, revenue: 630000 },
      { id: 11, name: '12', sales: 180, revenue: 540000 }
    ]
  },
  {
    name: 'Chery',
    models: [
      { id: 12, name: 'Tiggo 7 Pro', sales: 380, revenue: 760000 },
      { id: 13, name: 'Tiggo 8 Pro', sales: 350, revenue: 875000 },
      { id: 14, name: 'Arrizo 5', sales: 290, revenue: 580000 },
      { id: 15, name: 'Tiggo 4 Pro', sales: 270, revenue: 540000 }
    ]
  },
  {
    name: 'Geely',
    models: [
      { id: 16, name: 'Coolray', sales: 360, revenue: 720000 },
      { id: 17, name: 'Atlas Pro', sales: 320, revenue: 800000 },
      { id: 18, name: 'Tugella', sales: 280, revenue: 840000 },
      { id: 19, name: 'Monjaro', sales: 240, revenue: 720000 }
    ]
  },
  {
    name: 'Great Wall',
    models: [
      { id: 20, name: 'Wingle 7', sales: 310, revenue: 620000 },
      { id: 21, name: 'Poer', sales: 280, revenue: 700000 },
      { id: 22, name: 'Cannon', sales: 240, revenue: 600000 }
    ]
  }
])

// Filter brands based on selection
const filteredBrandsData = computed(() => {
  if (!selectedBrand.value) return brandsData.value
  return brandsData.value.filter(brand => brand.name === selectedBrand.value)
})

// Find max sales for progress bar scaling
const maxSales = computed(() => {
  let max = 0
  brandsData.value.forEach(brand => {
    brand.models.forEach(model => {
      if (model.sales > max) max = model.sales
    })
  })
  return max
})

// Generate heatmap data
const months = computed(() => [
  t('months.jan'), t('months.feb'), t('months.mar'), 
  t('months.apr'), t('months.may'), t('months.jun'), 
  t('months.jul'), t('months.aug'), t('months.sep'), 
  t('months.oct'), t('months.nov'), t('months.dec')
])
const brands = ['BYD', 'AITO', 'Avatr', 'Chery', 'Geely', 'Great Wall', 'Changan']

const generateHeatmapData = () => {
  const data = []
  for (let i = 0; i < brands.length; i++) {
    for (let j = 0; j < 12; j++) { // 12 months
      // Generate random sales data between 0-100
      const value = Math.floor(Math.random() * 100)
      data.push([j, i, value])
    }
  }
  return data
}

const heatmapData = generateHeatmapData()

const heatmapOption = computed(() => {
  return {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `${brands[params.value[1]]}<br>${months.value[params.value[0]]}: ${params.value[2]}`
      }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: months.value,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: brands,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      color: ['#F59E0B', '#3B82F6', '#1F2937']
    },
    series: [{
      name: 'Sales Intensity',
      type: 'heatmap',
      data: heatmapData,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
})

const toggleBrand = (brand) => {
  const index = expandedBrands.value.indexOf(brand.name)
  if (index === -1) {
    expandedBrands.value.push(brand.name)
  } else {
    expandedBrands.value.splice(index, 1)
  }
}

const toggleModels = () => {
  showAllModels.value = !showAllModels.value
}

const clearBrandFilter = () => {
  selectedBrand.value = ''
  router.push({ path: '/brands-models' })
}

const handleModelClick = (model) => {
  // Navigate to model details for the selected model
  router.push({
    path: '/model-details',
    query: { id: getModelId(model.name) }
  })
}

const getModelId = (modelName) => {
  // Map model names to their IDs
  const modelIdMap = {
    'Han': '1',
    'Tang': '2',
    'Tiggo 7 Pro': '3',
    'Coolray': '4',
    'M5': '5',
    'Poer': '6'
  }
  
  return modelIdMap[modelName] || '1' // Default to BYD Han if not found
}

const showDetails = (brand, model) => {
  router.push({
    path: '/orders',
    query: { brand, model: model.name }
  })
}

onMounted(() => {
  // Simulate loading data from an API
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.sales-by-brands-models {
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #F3F4F6;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #E5E7EB;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.brand-filter {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: #3B82F6;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.remove-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 0.5rem;
  cursor: pointer;
}

.heatmap-container {
  position: relative;
  height: 350px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.heatmap-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.75rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #F3F4F6;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.models-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #F3F4F6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.brand-header:hover {
  background-color: #E5E7EB;
}

.brand-name {
  margin: 0;
  font-size: 1.125rem;
}

.toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.models-table {
  padding: 1rem;
}

.sales-progress {
  position: relative;
  width: 100%;
  height: 1.5rem;
  background-color: #F3F4F6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 0.25rem;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1F2937;
  font-weight: 500;
  font-size: 0.875rem;
}

.details-btn {
  padding: 0.375rem 0.75rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.details-btn:hover {
  background-color: #2563EB;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-controls {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .heatmap-container {
    height: 300px;
  }
}
</style>
, sortable: true },
  { key: 'actions', label: $t('orderDetails.actions') }
]

// Mock data for brands and models
const brandsData = ref([
  {
    name: 'BYD',
    models: [
      { id: 1, name: 'Han', sales: 520, revenue: 1300000 },
      { id: 2, name: 'Tang', sales: 480, revenue: 1150000 },
      { id: 3, name: 'Song Plus', sales: 450, revenue: 900000 },
      { id: 4, name: 'Seal', sales: 380, revenue: 950000 },
      { id: 5, name: 'Dolphin', sales: 350, revenue: 700000 },
      { id: 6, name: 'Atto 3', sales: 320, revenue: 640000 }
    ]
  },
  {
    name: 'AITO',
    models: [
      { id: 7, name: 'M5', sales: 340, revenue: 850000 },
      { id: 8, name: 'M7', sales: 280, revenue: 840000 },
      { id: 9, name: 'M9', sales: 220, revenue: 660000 }
    ]
  },
  {
    name: 'Avatr',
    models: [
      { id: 10, name: '11', sales: 210, revenue: 630000 },
      { id: 11, name: '12', sales: 180, revenue: 540000 }
    ]
  },
  {
    name: 'Chery',
    models: [
      { id: 12, name: 'Tiggo 7 Pro', sales: 380, revenue: 760000 },
      { id: 13, name: 'Tiggo 8 Pro', sales: 350, revenue: 875000 },
      { id: 14, name: 'Arrizo 5', sales: 290, revenue: 580000 },
      { id: 15, name: 'Tiggo 4 Pro', sales: 270, revenue: 540000 }
    ]
  },
  {
    name: 'Geely',
    models: [
      { id: 16, name: 'Coolray', sales: 360, revenue: 720000 },
      { id: 17, name: 'Atlas Pro', sales: 320, revenue: 800000 },
      { id: 18, name: 'Tugella', sales: 280, revenue: 840000 },
      { id: 19, name: 'Monjaro', sales: 240, revenue: 720000 }
    ]
  },
  {
    name: 'Great Wall',
    models: [
      { id: 20, name: 'Wingle 7', sales: 310, revenue: 620000 },
      { id: 21, name: 'Poer', sales: 280, revenue: 700000 },
      { id: 22, name: 'Cannon', sales: 240, revenue: 600000 }
    ]
  }
])

// Filter brands based on selection
const filteredBrandsData = computed(() => {
  if (!selectedBrand.value) return brandsData.value
  return brandsData.value.filter(brand => brand.name === selectedBrand.value)
})

// Find max sales for progress bar scaling
const maxSales = computed(() => {
  let max = 0
  brandsData.value.forEach(brand => {
    brand.models.forEach(model => {
      if (model.sales > max) max = model.sales
    })
  })
  return max
})

// Generate heatmap data
const months = computed(() => [
  $t('months.jan'), $t('months.feb'), $t('months.mar'),
  $t('months.apr'), $t('months.may'), $t('months.jun'),
  $t('months.jul'), $t('months.aug'), $t('months.sep'),
  $t('months.oct'), $t('months.nov'), $t('months.dec')
])
const brands = ['BYD', 'AITO', 'Avatr', 'Chery', 'Geely', 'Great Wall', 'Changan']

const generateHeatmapData = () => {
  const data = []
  for (let i = 0; i < brands.length; i++) {
    for (let j = 0; j < months.length; j++) {
      // Generate random sales data between 0-100
      const value = Math.floor(Math.random() * 100)
      data.push([j, i, value])
    }
  }
  return data
}

const heatmapData = generateHeatmapData()

const heatmapOption = computed(() => {
  return {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `${brands[params.value[1]]}<br>${months[params.value[0]]}: ${params.value[2]}`
      }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: months,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: brands,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      color: ['#F59E0B', '#3B82F6', '#1F2937']
    },
    series: [{
      name: 'Sales Intensity',
      type: 'heatmap',
      data: heatmapData,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
})

const toggleBrand = (brand) => {
  const index = expandedBrands.value.indexOf(brand.name)
  if (index === -1) {
    expandedBrands.value.push(brand.name)
  } else {
    expandedBrands.value.splice(index, 1)
  }
}

const toggleModels = () => {
  showAllModels.value = !showAllModels.value
}

const clearBrandFilter = () => {
  selectedBrand.value = ''
  router.push({ path: '/brands-models' })
}

const handleModelClick = (model) => {
  // Navigate to model details for the selected model
  router.push({
    path: '/model-details',
    query: { id: getModelId(model.name) }
  })
}

const getModelId = (modelName) => {
  // Map model names to their IDs
  const modelIdMap = {
    'Han': '1',
    'Tang': '2',
    'Tiggo 7 Pro': '3',
    'Coolray': '4',
    'M5': '5',
    'Poer': '6'
  }
  
  return modelIdMap[modelName] || '1' // Default to BYD Han if not found
}

const showDetails = (brand, model) => {
  router.push({
    path: '/orders',
    query: { brand, model: model.name }
  })
}

onMounted(() => {
  // Simulate loading data from an API
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.sales-by-brands-models {
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #F3F4F6;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #E5E7EB;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.brand-filter {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: #3B82F6;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.remove-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 0.5rem;
  cursor: pointer;
}

.heatmap-container {
  position: relative;
  height: 350px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.heatmap-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.75rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #F3F4F6;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.models-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #F3F4F6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.brand-header:hover {
  background-color: #E5E7EB;
}

.brand-name {
  margin: 0;
  font-size: 1.125rem;
}

.toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.models-table {
  padding: 1rem;
}

.sales-progress {
  position: relative;
  width: 100%;
  height: 1.5rem;
  background-color: #F3F4F6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 0.25rem;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1F2937;
  font-weight: 500;
  font-size: 0.875rem;
}

.details-btn {
  padding: 0.375rem 0.75rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.details-btn:hover {
  background-color: #2563EB;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-controls {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .heatmap-container {
    height: 300px;
  }
}
</style>
