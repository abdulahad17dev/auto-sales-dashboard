<template>
  <div class="model-details">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <div v-else class="model-content">
      <div class="model-header">
        <div class="model-info">
          <div class="model-brand">{{ modelData.brand }}</div>
          <h2 class="model-name">{{ modelData.name }}</h2>
          
          <div class="model-badges">
            <div class="model-badge type">{{ modelData.type }}</div>
            <div class="model-badge year">{{ modelData.year }}</div>
            <div v-if="modelData.isNew" class="model-badge new">{{ $t('modelDetails.newModel') }}</div>
            <div v-if="modelData.isElectric" class="model-badge electric">{{ $t('modelDetails.electricVehicle') }}</div>
          </div>
        </div>
        
        <div class="model-stats">
          <div class="stat-item">
            <div class="stat-label">{{ $t('modelDetails.sales') }}</div>
            <div class="stat-value">{{ formatNumber(modelData.sales) }}</div>
            <div :class="['stat-change', modelData.salesChange >= 0 ? 'positive' : 'negative']">
              <component :is="modelData.salesChange >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
              {{ Math.abs(modelData.salesChange) }}%
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">{{ $t('modelDetails.averagePrice') }}</div>
            <div class="stat-value">${{ formatNumber(modelData.averagePrice) }}</div>
            <div :class="['stat-change', modelData.priceChange >= 0 ? 'positive' : 'negative']">
              <component :is="modelData.priceChange >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
              {{ Math.abs(modelData.priceChange) }}%
            </div>
          </div>
        </div>
      </div>
      
      <div class="model-details-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </div>
      </div>
      
      <div class="tab-content">
        <!-- Specifications Tab -->
        <div v-if="activeTab === 'specs'" class="specs-tab">
          <div class="specs-section" v-for="(section, sectionIndex) in modelData.specifications" :key="sectionIndex">
            <h3 class="section-title">{{ section.title }}</h3>
            <div class="specs-grid">
              <div class="spec-item" v-for="(spec, specIndex) in section.items" :key="specIndex">
                <div class="spec-label">{{ spec.label }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sales Tab -->
        <div v-else-if="activeTab === 'sales'" class="sales-tab">
          <div class="sales-chart">
            <h3>{{ $t('modelDetails.salesByMonth') }}</h3>
            <div class="chart-container">
              <v-chart :option="salesChartOption" autoresize />
            </div>
          </div>
          
          <div class="sales-by-region">
            <h3>{{ $t('modelDetails.salesByRegion') }}</h3>
            <div class="regions-grid">
              <div class="region-item" v-for="region in modelData.salesByRegion" :key="region.name">
                <div class="region-name">{{ region.name }}</div>
                <div class="region-bar-container">
                  <div 
                    class="region-bar" 
                    :style="{ width: `${(region.value / maxRegionValue) * 100}%` }"
                  ></div>
                  <div class="region-value">{{ formatNumber(region.value) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Localization Tab -->
        <div v-else-if="activeTab === 'localization'" class="localization-tab">
          <div class="localization-status">
            <h3>{{ $t('modelDetails.localizationStatus') }}</h3>
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: `${modelData.localization.progress}%` }"></div>
              <div class="progress-label">{{ modelData.localization.progress }}% {{ $t('modelDetails.completed') }}</div>
            </div>
          </div>
          
          <div class="localized-documents">
            <h3>{{ $t('modelDetails.localizedDocuments') }}</h3>
            <div class="documents-grid">
              <div class="document-item" v-for="document in modelData.localization.documents" :key="document.id">
                <div class="document-icon">
                  <FileText v-if="document.type === 'manual'" class="doc-icon" />
                  <FileVideo v-else-if="document.type === 'multimedia'" class="doc-icon" />
                  <FileCheck v-else-if="document.type === 'certification'" class="doc-icon" />
                  <FileSpreadsheet v-else-if="document.type === 'specifications'" class="doc-icon" />
                  <File v-else class="doc-icon" />
                </div>
                <div class="document-details">
                  <div class="document-name">{{ document.name }}</div>
                  <div class="document-meta">
                    <span class="document-lang">{{ document.language }}</span>
                    <span class="document-size">{{ document.size }}</span>
                  </div>
                </div>
                <div class="document-status" :class="document.status">
                  {{ t('documents.' + document.status) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="localization-languages">
            <h3>{{ $t('modelDetails.localizationLanguages') }}</h3>
            <div class="languages-grid">
              <div 
                v-for="language in modelData.localization.languages" 
                :key="language.code"
                class="language-item"
              >
                <div class="language-flag">{{ language.flag }}</div>
                <div class="language-details">
                  <div class="language-name">{{ language.name }}</div>
                  <div class="language-progress-container">
                    <div 
                      class="language-progress" 
                      :style="{ width: `${language.progress}%` }"
                    ></div>
                    <div class="language-percent">{{ language.progress }}%</div>
                  </div>
                </div>
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
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, MarkPointComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { TrendingUp, TrendingDown, FileText, FileVideo, FileCheck, FileSpreadsheet, File } from 'lucide-vue-next'

// Register ECharts components
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent
])

// Props
const props = defineProps({
  modelId: {
    type: [String, Number],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Get i18n
const { t } = useI18n()

// Reactive state
const activeTab = ref('specs')
const tabs = computed(() => [
  { id: 'specs', label: t('modelDetails.specifications') },
  { id: 'sales', label: t('modelDetails.sales') },
  { id: 'localization', label: t('modelDetails.localization') }
])

// Make model data reactive with computed properties
const vehicleType = computed(() => t('modelDetails.vehicleTypes.sedan'))
const monthNames = computed(() => ([
  t('months.jan'), t('months.feb'), t('months.mar'), 
  t('months.apr'), t('months.may'), t('months.jun'),
  t('months.jul'), t('months.aug'), t('months.sep'), 
  t('months.oct'), t('months.nov'), t('months.dec')
]))

// Mock data for a specific model - non-reactive base data
const baseModelData = {
  id: 1,
  brand: 'BYD',
  name: 'Han',
  year: '2025',
  isNew: true,
  isElectric: true,
  sales: 12850,
  salesChange: 36.5,
  averagePrice: 42500,
  priceChange: 4.8,
  specifications: [
    {
      title: 'Основные характеристики',
      items: [
        { label: 'Тип кузова', value: 'Седан' },
        { label: 'Длина', value: '4980 мм' },
        { label: 'Ширина', value: '1910 мм' },
        { label: 'Высота', value: '1495 мм' },
        { label: 'Колесная база', value: '2920 мм' },
        { label: 'Масса', value: '2050 кг' }
      ]
    },
    {
      title: 'Двигатель и трансмиссия',
      items: [
        { label: 'Тип', value: 'Электродвигатель' },
        { label: 'Мощность', value: '517 л.с.' },
        { label: 'Крутящий момент', value: '700 Нм' },
        { label: 'Батарея', value: '85.4 кВт⋅ч' },
        { label: 'Запас хода', value: '605 км' },
        { label: 'Привод', value: 'Полный' }
      ]
    },
    {
      title: 'Динамические характеристики',
      items: [
        { label: 'Разгон 0-100 км/ч', value: '3.9 с' },
        { label: 'Максимальная скорость', value: '180 км/ч' },
        { label: 'Потребление энергии', value: '17.6 кВт⋅ч/100км' }
      ]
    }
  ],
  salesByMonth: [
    { month: 'Янв', value: 850 },
    { month: 'Фев', value: 920 },
    { month: 'Мар', value: 1050 },
    { month: 'Апр', value: 1150 },
    { month: 'Май', value: 1250 },
    { month: 'Июн', value: 1380 },
    { month: 'Июл', value: 1450 },
    { month: 'Авг', value: 1520 },
    { month: 'Сен', value: 1650 },
    { month: 'Окт', value: 1750 },
    { month: 'Ноя', value: 1880 },
    { month: 'Дек', value: 2050 }
  ],
  salesByRegion: [
    { name: 'Москва', value: 2850 },
    { name: 'Санкт-Петербург', value: 1950 },
    { name: 'Екатеринбург', value: 1250 },
    { name: 'Новосибирск', value: 980 },
    { name: 'Казань', value: 780 },
    { name: 'Ростов-на-Дону', value: 680 },
    { name: 'Нижний Новгород', value: 620 },
    { name: 'Другие регионы', value: 3740 }
  ],
  localization: {
    progress: 78,
    documents: [
      { id: 1, name: t('documents.userManual'), type: 'manual', language: t('languages.russian'), size: '4.2 ' + t('documents.mb'), status: 'completed' },
      { id: 2, name: t('documents.serviceDocumentation'), type: 'specifications', language: t('languages.russian'), size: '2.8 ' + t('documents.mb'), status: 'completed' },
      { id: 3, name: t('documents.warrantyCard'), type: 'certification', language: t('languages.russian'), size: '1.5 ' + t('documents.mb'), status: 'completed' },
      { id: 4, name: t('documents.multimediaSystem'), type: 'multimedia', language: t('languages.russian'), size: '3.7 ' + t('documents.mb'), status: 'in-progress' },
      { id: 5, name: t('documents.userManual'), type: 'manual', language: t('languages.kazakh'), size: '4.2 ' + t('documents.mb'), status: 'in-progress' },
      { id: 6, name: t('documents.userManual'), type: 'manual', language: t('languages.belarusian'), size: '4.1 ' + t('documents.mb'), status: 'pending' }
    ],
    languages: [
      { code: 'ru', name: t('languages.russian'), flag: '🇷🇺', progress: 95 },
      { code: 'kz', name: t('languages.kazakh'), flag: '🇰🇿', progress: 72 },
      { code: 'by', name: t('languages.belarusian'), flag: '🇧🇾', progress: 68 },
      { code: 'uz', name: t('languages.uzbek'), flag: '🇺🇿', progress: 62 },
      { code: 'az', name: t('languages.azerbaijani'), flag: '🇦🇿', progress: 58 },
      { code: 'ua', name: t('languages.ukrainian'), flag: '🇺🇦', progress: 45 }
    ]
  }
}

// Create specifications with proper localization
const localizedSpecifications = computed(() => [
  {
    title: t('vehicleDetails.basicSpecifications'),
    items: [
      { label: t('modelDetails.specs.bodyType'), value: t('modelDetails.vehicleTypes.sedan') },
      { label: t('modelDetails.specs.length'), value: '4980 ' + t('modelDetails.units.mm') },
      { label: t('modelDetails.specs.width'), value: '1910 ' + t('modelDetails.units.mm') },
      { label: t('modelDetails.specs.height'), value: '1495 ' + t('modelDetails.units.mm') },
      { label: t('modelDetails.specs.wheelbase'), value: '2920 ' + t('modelDetails.units.mm') },
      { label: t('modelDetails.specs.weight'), value: '2050 ' + t('modelDetails.units.kg') }
    ]
  },
  {
    title: t('vehicleDetails.powertrain'),
    items: [
      { label: t('modelDetails.specs.type'), value: t('modelDetails.specs.electric') },
      { label: t('modelDetails.specs.power'), value: '517 ' + t('modelDetails.units.hp') },
      { label: t('modelDetails.specs.torque'), value: '700 ' + t('modelDetails.units.nm') },
      { label: t('modelDetails.specs.battery'), value: '85.4 ' + t('modelDetails.units.kwh') },
      { label: t('modelDetails.specs.range'), value: '605 ' + t('modelDetails.units.km') },
      { label: t('modelDetails.specs.driveType'), value: t('modelDetails.specs.awd') }
    ]
  },
  {
    title: t('vehicleDetails.performance'),
    items: [
      { label: t('modelDetails.specs.acceleration'), value: '3.9 ' + t('modelDetails.units.sec') },
      { label: t('modelDetails.specs.topSpeed'), value: '180 ' + t('modelDetails.units.kmh') },
      { label: t('modelDetails.specs.energyConsumption'), value: '17.6 ' + t('modelDetails.units.kwhPer100km') }
    ]
  }
])

// Localize region names
const localizedSalesByRegion = computed(() => [
  { name: t('regions.moscow'), value: 2850 },
  { name: t('regions.saintPetersburg'), value: 1950 },
  { name: t('regions.ekaterinburg'), value: 1250 },
  { name: t('regions.novosibirsk'), value: 980 },
  { name: t('regions.kazan'), value: 780 },
  { name: t('regions.rostovOnDon'), value: 680 },
  { name: t('regions.nizhnyNovgorod'), value: 620 },
  { name: t('regions.otherRegions'), value: 3740 }
])

// Create a reactive version of the model data
const modelData = computed(() => {
  return {
    ...baseModelData,
    type: vehicleType.value,
    // Use localized specifications
    specifications: localizedSpecifications.value,
    // Use localized regions
    salesByRegion: localizedSalesByRegion.value,
    // Transform salesByMonth to use translated month names
    salesByMonth: baseModelData.salesByMonth.map((item, index) => ({
      month: monthNames.value[index],
      value: item.value
    }))
  }
})

// Computed properties
const maxRegionValue = computed(() => {
  return Math.max(...modelData.value.salesByRegion.map(region => region.value))
})

// Chart options
const salesChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => `${params[0].name}: ${params[0].value} ${t('modelDetails.salesUnit')}`
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: modelData.value.salesByMonth.map(item => item.month)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: t('modelDetails.sales'),
        type: 'line',
        data: modelData.value.salesByMonth.map(item => item.value),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3B82F6'
        },
        itemStyle: {
          color: '#3B82F6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.1)'
              }
            ]
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: t('modelDetails.maximum') }
          ]
        }
      }
    ]
  }
})

// Helper functions
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
</script>

<style scoped>
.model-details {
  position: relative;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
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
  border-radius: 0.75rem;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #F3F4F6;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.model-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.model-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.model-info {
  flex: 1;
  min-width: 250px;
}

.model-brand {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.model-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.model-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.model-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.model-badge.type {
  background-color: #F3F4F6;
  color: #1F2937;
}

.model-badge.year {
  background-color: #E5E7EB;
  color: #4B5563;
}

.model-badge.new {
  background-color: #FEF3C7;
  color: #92400E;
}

.model-badge.electric {
  background-color: #DCFCE7;
  color: #166534;
}

.model-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10B981;
}

.stat-change.negative {
  color: #EF4444;
}

.change-icon {
  width: 1rem;
  height: 1rem;
}

.model-details-tabs {
  display: flex;
  border-bottom: 1px solid #E5E7EB;
}

.tab {
  padding: 0.75rem 1rem;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  color: #3B82F6;
}

.tab.active {
  color: #3B82F6;
  border-bottom-color: #3B82F6;
}

.tab-content {
  padding: 1.5rem 0;
  flex: 1;
  overflow-y: auto;
}

/* Specifications Tab */
.specs-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1F2937;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.spec-label {
  font-size: 0.875rem;
  color: #6B7280;
}

.spec-value {
  font-weight: 500;
}

/* Sales Tab */
.sales-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sales-chart h3,
.sales-by-region h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1F2937;
}

.chart-container {
  height: 300px;
}

.regions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.region-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.region-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.region-bar-container {
  position: relative;
  height: 2rem;
  background-color: #F3F4F6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.region-bar {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 0.25rem 0 0 0.25rem;
}

.region-value {
  position: absolute;
  top: 0;
  right: 0.5rem;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Localization Tab */
.localization-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.localization-status h3,
.localized-documents h3,
.localization-languages h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1F2937;
}

.progress-container {
  position: relative;
  height: 2rem;
  background-color: #F3F4F6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #10B981;
  border-radius: 0.25rem 0 0 0.25rem;
}

.progress-label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
}

.document-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.doc-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3B82F6;
}

.document-details {
  flex: 1;
  min-width: 0;
}

.document-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6B7280;
}

.document-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.document-status.completed {
  background-color: #D1FAE5;
  color: #065F46;
}

.document-status.in-progress {
  background-color: #FEF3C7;
  color: #92400E;
}

.document-status.pending {
  background-color: #F3F4F6;
  color: #4B5563;
}

.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.language-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
}

.language-flag {
  font-size: 1.5rem;
}

.language-details {
  flex: 1;
}

.language-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.language-progress-container {
  position: relative;
  height: 0.5rem;
  background-color: #E5E7EB;
  border-radius: 0.25rem;
  overflow: hidden;
}

.language-progress {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 0.25rem 0 0 0.25rem;
}

.language-percent {
  position: absolute;
  top: 0;
  right: 0.25rem;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: 0.625rem;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .model-header {
    flex-direction: column;
  }
  
  .model-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .specs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .regions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 639px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>