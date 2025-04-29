<template>
  <div class="region-heatmap">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <div v-else class="heatmap-container">
      <div class="map-top-regions">
        <h3>{{ $t('components.regionHeatmap.topRegions') }}</h3>
        <div class="top-regions-list">
          <div 
            v-for="(region, index) in topRegions" 
            :key="region.name"
            class="region-item"
          >
            <div class="region-rank">{{ index + 1 }}</div>
            <div class="region-details">
              <div class="region-name">{{ region.name }}</div>
              <div class="region-value">{{ formatNumber(region.value) }} {{ $t('components.regionHeatmap.sales') }}</div>
            </div>
            <div class="region-bar-container">
              <div 
                class="region-bar" 
                :style="{ width: `${(region.value / maxValue) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="map-container">
        <div class="map-legend">
          <h4>{{ $t('components.regionHeatmap.salesByRegion') }}</h4>
          <div class="legend-scale">
            <div class="legend-colors"></div>
            <div class="legend-labels">
              <span>{{ $t('components.regionHeatmap.low') }}</span>
              <span>{{ $t('components.regionHeatmap.high') }}</span>
            </div>
          </div>
        </div>
        
        <div class="region-map">
          <!-- This is a simplified placeholder for the Russian regions heatmap -->
          <!-- In a real application, this would use a proper SVG map of Russia -->
          <div class="map-grid">
            <div 
              v-for="region in regions" 
              :key="region.id"
              class="region-block"
              :style="{ backgroundColor: getHeatColor(region.value) }"
              @mouseover="showTooltip(region, $event)"
              @mouseleave="hideTooltip"
            >
              <div class="region-code">{{ getLocalizedCode(region.code) }}</div>
            </div>
          </div>
          
          <!-- Tooltip -->
          <div 
            v-if="tooltipVisible" 
            class="region-tooltip"
            :style="{ top: tooltipPos.top + 'px', left: tooltipPos.left + 'px' }"
          >
            <div class="tooltip-title">{{ getLocalizedCityName(tooltipRegion.name) }}</div>
            <div class="tooltip-value">{{ formatNumber(tooltipRegion.value) }} {{ $t('components.regionHeatmap.sales') }}</div>
            <div class="tooltip-models">
              <div class="tooltip-subtitle">{{ $t('components.regionHeatmap.popularModels') }}:</div>
              <div v-for="model in tooltipRegion.topModels" :key="model.name" class="tooltip-model">
                {{ model.name }}: {{ model.percentage }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props passed to component
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Tooltip state
const tooltipVisible = ref(false)
const tooltipRegion = ref({})
const tooltipPos = ref({ top: 0, left: 0 })

// Tooltip handlers
const showTooltip = (region, event) => {
  tooltipRegion.value = region
  tooltipVisible.value = true
  
  // Position tooltip relative to mouse, but ensure it stays within viewport
  const rect = event.target.getBoundingClientRect()
  tooltipPos.value = {
    top: rect.top - 5,
    left: rect.right + 10
  }
  
  // Check if tooltip would go off-screen and adjust if necessary
  setTimeout(() => {
    const tooltip = document.querySelector('.region-tooltip')
    if (tooltip) {
      const tooltipRect = tooltip.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      if (tooltipRect.right > viewportWidth) {
        tooltipPos.value.left = rect.left - tooltipRect.width - 10
      }
      
      if (tooltipRect.bottom > viewportHeight) {
        tooltipPos.value.top = viewportHeight - tooltipRect.height - 10
      }
    }
  }, 0)
}

const hideTooltip = () => {
  tooltipVisible.value = false
}

// Generate mock data for Russian regions
const regions = [
  { id: 1, code: 'МСК', name: 'Москва', value: 12500, topModels: [
    { name: 'BYD Han', percentage: 32 },
    { name: 'Geely Coolray', percentage: 28 },
    { name: 'Chery Tiggo 7 Pro', percentage: 24 }
  ]},
  { id: 2, code: 'СПБ', name: 'Санкт-Петербург', value: 8700, topModels: [
    { name: 'BYD Tang', percentage: 30 },
    { name: 'Chery Tiggo 8 Pro', percentage: 26 },
    { name: 'Geely Atlas Pro', percentage: 22 }
  ]},
  { id: 3, code: 'НСК', name: 'Новосибирск', value: 5200, topModels: [
    { name: 'Geely Coolray', percentage: 31 },
    { name: 'Great Wall Poer', percentage: 27 },
    { name: 'BYD Song Plus', percentage: 23 }
  ]},
  { id: 4, code: 'ЕКБ', name: 'Екатеринбург', value: 4800, topModels: [
    { name: 'Chery Tiggo 7 Pro', percentage: 29 },
    { name: 'BYD Han', percentage: 26 },
    { name: 'Great Wall Poer', percentage: 22 }
  ]},
  { id: 5, code: 'КЗН', name: 'Казань', value: 4200, topModels: [
    { name: 'Chery Tiggo 8 Pro', percentage: 28 },
    { name: 'BYD Song Plus', percentage: 25 },
    { name: 'Geely Atlas Pro', percentage: 22 }
  ]},
  { id: 6, code: 'ННВ', name: 'Нижний Новгород', value: 3800, topModels: [
    { name: 'Geely Coolray', percentage: 30 },
    { name: 'BYD Seal', percentage: 26 },
    { name: 'Chery Tiggo 4 Pro', percentage: 21 }
  ]},
  { id: 7, code: 'ЧЛБ', name: 'Челябинск', value: 3500, topModels: [
    { name: 'Great Wall Poer', percentage: 32 },
    { name: 'Chery Tiggo 7 Pro', percentage: 27 },
    { name: 'BYD Tang', percentage: 23 }
  ]},
  { id: 8, code: 'РСТ', name: 'Ростов-на-Дону', value: 3300, topModels: [
    { name: 'BYD Han', percentage: 29 },
    { name: 'Geely Tugella', percentage: 26 },
    { name: 'Chery Tiggo 8 Pro', percentage: 24 }
  ]},
  { id: 9, code: 'УФА', name: 'Уфа', value: 3100, topModels: [
    { name: 'Chery Tiggo 7 Pro', percentage: 31 },
    { name: 'BYD Han', percentage: 25 },
    { name: 'Geely Coolray', percentage: 22 }
  ]},
  { id: 10, code: 'КРС', name: 'Красноярск', value: 2800, topModels: [
    { name: 'Great Wall Cannon', percentage: 34 },
    { name: 'BYD Tang', percentage: 27 },
    { name: 'Geely Atlas Pro', percentage: 22 }
  ]},
  { id: 11, code: 'ВЛГ', name: 'Волгоград', value: 2600, topModels: [
    { name: 'Chery Tiggo 8 Pro', percentage: 28 },
    { name: 'BYD Dolphin', percentage: 24 },
    { name: 'Geely Coolray', percentage: 21 }
  ]},
  { id: 12, code: 'ПРМ', name: 'Пермь', value: 2400, topModels: [
    { name: 'BYD Han', percentage: 29 },
    { name: 'Great Wall Poer', percentage: 26 },
    { name: 'Chery Tiggo 7 Pro', percentage: 23 }
  ]},
  { id: 13, code: 'ВРЖ', name: 'Воронеж', value: 2200, topModels: [
    { name: 'Geely Atlas Pro', percentage: 30 },
    { name: 'BYD Tang', percentage: 25 },
    { name: 'Chery Tiggo 4 Pro', percentage: 21 }
  ]},
  { id: 14, code: 'СМР', name: 'Самара', value: 2100, topModels: [
    { name: 'BYD Han', percentage: 32 },
    { name: 'Chery Tiggo 7 Pro', percentage: 27 },
    { name: 'Geely Coolray', percentage: 22 }
  ]},
  { id: 15, code: 'КРД', name: 'Краснодар', value: 2000, topModels: [
    { name: 'Chery Tiggo 8 Pro', percentage: 29 },
    { name: 'BYD Seal', percentage: 25 },
    { name: 'Geely Tugella', percentage: 24 }
  ]},
  { id: 16, code: 'СРТ', name: 'Саратов', value: 1800, topModels: [
    { name: 'BYD Tang', percentage: 31 },
    { name: 'Chery Tiggo 7 Pro', percentage: 28 },
    { name: 'Great Wall Poer', percentage: 22 }
  ]},
  { id: 17, code: 'ТЛТ', name: 'Тольятти', value: 1600, topModels: [
    { name: 'Geely Coolray', percentage: 30 },
    { name: 'BYD Han', percentage: 27 },
    { name: 'Chery Tiggo 4 Pro', percentage: 21 }
  ]},
  { id: 18, code: 'ИЖВ', name: 'Ижевск', value: 1500, topModels: [
    { name: 'BYD Tang', percentage: 29 },
    { name: 'Great Wall Cannon', percentage: 25 },
    { name: 'Chery Tiggo 7 Pro', percentage: 22 }
  ]},
  { id: 19, code: 'БРН', name: 'Барнаул', value: 1400, topModels: [
    { name: 'Geely Atlas Pro', percentage: 30 },
    { name: 'BYD Dolphin', percentage: 26 },
    { name: 'Chery Tiggo 8 Pro', percentage: 23 }
  ]},
  { id: 20, code: 'ВЛВ', name: 'Владивосток', value: 1300, topModels: [
    { name: 'BYD Han', percentage: 34 },
    { name: 'Chery Tiggo 7 Pro', percentage: 27 },
    { name: 'Geely Tugella', percentage: 23 }
  ]}
]

// Calculate the top 5 regions for the sidebar
const topRegions = computed(() => {
  return [...regions].sort((a, b) => b.value - a.value).slice(0, 5)
})

// Find the maximum value for scaling
const maxValue = computed(() => {
  return Math.max(...regions.map(region => region.value))
})

// Format number with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Get localized city code
const getLocalizedCode = (code) => {
  const { locale } = useI18n()
  // If Chinese language is selected, return the translated short code
  if (locale.value === 'zh') {
    return t(`cityCodesShort.${code}`) !== `cityCodesShort.${code}` ? t(`cityCodesShort.${code}`) : code
  }
  return code
}

// Get localized city name
const getLocalizedCityName = (cityName) => {
  const { locale } = useI18n()
  
  // Convert Russian names to English key format for lookup
  const cityNameMap = {
    'Москва': 'moscow',
    'Санкт-Петербург': 'saintPetersburg',
    'Новосибирск': 'novosibirsk',
    'Екатеринбург': 'ekaterinburg',
    'Казань': 'kazan',
    'Нижний Новгород': 'nizhnyNovgorod',
    'Челябинск': 'chelyabinsk',
    'Ростов-на-Дону': 'rostovOnDon',
    'Уфа': 'ufa',
    'Красноярск': 'krasnoyarsk',
    'Волгоград': 'volgograd',
    'Пермь': 'perm',
    'Воронеж': 'voronezh',
    'Самара': 'samara',
    'Краснодар': 'krasnodar',
    'Саратов': 'saratov',
    'Тольятти': 'tolyatti',
    'Ижевск': 'izhevsk',
    'Барнаул': 'barnaul',
    'Владивосток': 'vladivostok'
  }
  
  if (locale.value === 'zh' && cityNameMap[cityName]) {
    return t(`cityNames.${cityNameMap[cityName]}`)
  }
  
  return cityName
}

// Get a heat color based on value
const getHeatColor = (value) => {
  // Calculate percentage of max value (0-1)
  const percent = value / maxValue.value
  
  // Create a gradient from blue to red
  const r = Math.round(255 * percent)
  const g = Math.round(255 * (1 - Math.abs(percent - 0.5) * 2))
  const b = Math.round(255 * (1 - percent))
  
  return `rgb(${r}, ${g}, ${b})`
}
</script>

<style scoped>
.region-heatmap {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #F3F4F6;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.heatmap-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1rem;
  height: 100%;
}

.map-top-regions {
  background-color: #F9FAFB;
  padding: 1rem;
  border-radius: 0.5rem;
}

.map-top-regions h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.top-regions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.region-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.region-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #E5E7EB;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.region-details {
  flex: 1;
  min-width: 0;
}

.region-name {
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.region-value {
  font-size: 0.75rem;
  color: #6B7280;
}

.region-bar-container {
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  width: 100%;
  height: 4px;
  background-color: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
}

.region-bar {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 2px;
}

.map-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-legend h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}

.legend-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.legend-colors {
  width: 150px;
  height: 8px;
  background: linear-gradient(to right, blue, green, yellow, red);
  border-radius: 4px;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  width: 150px;
  font-size: 0.75rem;
  color: #6B7280;
  margin-top: 0.25rem;
}

.region-map {
  flex: 1;
  position: relative;
  min-height: 400px;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.5rem;
  height: 100%;
}

.region-block {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E5E7EB;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.region-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.region-code {
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}

.region-tooltip {
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  padding: 0.75rem;
  min-width: 200px;
  z-index: 20;
}

.tooltip-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.tooltip-value {
  font-size: 0.875rem;
  color: #3B82F6;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.tooltip-models {
  border-top: 1px solid #E5E7EB;
  padding-top: 0.5rem;
}

.tooltip-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.tooltip-model {
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.125rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1023px) {
  .heatmap-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .map-top-regions {
    padding: 0.75rem;
  }
  
  .top-regions-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 639px) {
  .top-regions-list {
    grid-template-columns: 1fr;
  }
  
  .map-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(7, 1fr);
  }
  
  .region-tooltip {
    position: fixed;
    top: auto !important;
    left: 0 !important;
    right: 0;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: 100%;
  }
}
</style>
