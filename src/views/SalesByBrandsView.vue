<template>
  <div class="sales-by-brands">
    <div class="page-header">
      <h1>{{ $t('salesByBrands.title') }}</h1>
      <div class="header-controls">
        <DatePicker v-model="selectedDate" class="date-picker" />
        <ExportButton :data="tableData" filename="chinese_brands_sales.csv" @export-success="showExportSuccess" />
      </div>
    </div>
    
    <div class="filters">
      <Select
        v-model="selectedRegion"
        :options="regionOptions"
        :label="$t('salesByBrands.region')"
        class="filter-select"
      />
      <Select
        v-model="selectedYear"
        :options="yearOptions"
        :label="$t('salesByBrands.year')"
        class="filter-select"
      />
      <div class="filter-actions">
        <button class="btn-accent">
          {{ $t('common.filter') }}
        </button>
      </div>
    </div>
    
    <div class="chart-container">
      <div v-if="loading" class="chart-loading">
        <div class="loading-spinner"></div>
      </div>
      <v-chart v-else :option="chartOption" autoresize />
    </div>
    
    <div class="table-section">
      <Table
        :columns="tableColumns"
        :data="tableData"
        :loading="loading"
        clickable
        @row-click="handleRowClick"
      >
        <template #cell-change="{ value }">
          <div :class="['change-value', value >= 0 ? 'positive' : 'negative']">
            <ChevronUp v-if="value > 0" class="change-icon" />
            <ChevronDown v-if="value < 0" class="change-icon" />
            {{ Math.abs(value) }}%
          </div>
        </template>
        <template #cell-actions="{ row }">
          <button 
            @click.stop="contactBrand(row)"
            class="action-btn"
          >
            {{ $t('salesByBrands.contact') }}
          </button>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import DatePicker from '@/components/ui/DatePicker.vue'
import Select from '@/components/ui/Select.vue'
import Table from '@/components/ui/Table.vue'
import ExportButton from '@/components/ui/ExportButton.vue'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const router = useRouter()
const { t } = useI18n()
const loading = ref(true)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedRegion = ref('')
const selectedYear = ref('')

// Mock data - in a real app, this would come from an API
const regionOptions = computed(() => [
  { value: 'all', label: t('regions.all') },
  { value: 'russia', label: t('regions.russia') },
  { value: 'belarus', label: t('regions.belarus') },
  { value: 'kazakhstan', label: t('regions.kazakhstan') },
  { value: 'uzbekistan', label: t('regions.uzbekistan') },
  { value: 'ukraine', label: t('regions.ukraine') },
  { value: 'georgia', label: t('regions.georgia') },
  { value: 'armenia', label: t('regions.armenia') },
  { value: 'azerbaijan', label: t('regions.azerbaijan') },
  { value: 'china-ports', label: t('regions.chinaPorts') }
])

const yearOptions = computed(() => [
  { value: 'all', label: t('years.all') },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' }
])

const tableColumns = computed(() => [
  { key: 'brand', label: t('salesByBrands.brand'), sortable: true },
  { key: 'deals', label: t('salesByBrands.deals'), sortable: true },
  { key: 'revenue', label: t('salesByBrands.revenue') + ', $', sortable: true },
  { key: 'change', label: t('salesByBrands.change'), sortable: true },
  { key: 'actions', label: t('orderDetails.actions') }
])

// Mock data for the table
const tableData = ref([
  { id: 1, brand: 'BYD', deals: 1450, revenue: 3250000, change: 22.8 },
  { id: 2, brand: 'Chery', deals: 1280, revenue: 2150000, change: 18.3 },
  { id: 3, brand: 'Geely', deals: 1150, revenue: 2050000, change: 15.7 },
  { id: 4, brand: 'Great Wall', deals: 980, revenue: 1870000, change: 12.4 },
  { id: 5, brand: 'Changan', deals: 870, revenue: 1550000, change: 9.8 },
  { id: 6, brand: 'AITO', deals: 760, revenue: 1750000, change: 8.5 },
  { id: 7, brand: 'JAC', deals: 650, revenue: 1200000, change: 6.2 },
  { id: 8, brand: 'FAW', deals: 580, revenue: 1150000, change: 4.7 },
  { id: 9, brand: 'Avatr', deals: 520, revenue: 1350000, change: 3.5 },
  { id: 10, brand: 'BAIC', deals: 490, revenue: 980000, change: -1.8 },
  { id: 11, brand: 'Haval', deals: 470, revenue: 940000, change: -2.5 },
  { id: 12, brand: 'Dongfeng', deals: 430, revenue: 860000, change: -3.2 }
])

const isMobile = ref(window.innerWidth <= 767)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 767
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        formatter: (value) => `${value}`,
        fontSize: isMobile.value ? 10 : 12
      }
    },
    yAxis: {
      type: 'category',
      data: tableData.value.map(item => item.brand),
      axisLabel: {
        fontSize: isMobile.value ? 10 : 12
      }
    },
    series: [
      {
        name: t('salesByBrands.deals'),
        type: 'bar',
        data: tableData.value.map(item => item.deals),
        itemStyle: {
          color: '#3B82F6'
        },
        barWidth: isMobile.value ? '60%' : '70%'
      }
    ]
  }
})

const handleRowClick = (row) => {
  router.push({
    path: '/model-details',
    query: { id: getModelIdByBrand(row.brand), brand: row.brand }
  })
}

const getModelIdByBrand = (brand) => {
  // Map brands to their most popular model IDs
  const brandModelMap = {
    'BYD': '1', // BYD Han
    'Chery': '3', // Chery Tiggo 7 Pro
    'Geely': '4', // Geely Coolray
    'Great Wall': '6', // Great Wall Poer
    'Changan': '9', // Some model ID
    'AITO': '5', // AITO M5
    'JAC': '10', // Some model ID
    'FAW': '11', // Some model ID
    'Avatr': '12', // Some model ID
    'BAIC': '13', // Some model ID
    'Haval': '14', // Some model ID
    'Dongfeng': '15' // Some model ID
  }
  
  return brandModelMap[brand] || '1' // Default to BYD Han if not found
}

const contactBrand = (brand) => {
  console.log('Contact brand:', brand)
  // In a real app, this would open a contact form or modal
}

const showExportSuccess = () => {
  // In a real app, this would show a toast notification
  alert(t('toast.exportSuccess'))
}

onMounted(() => {
  // Simulate loading data from an API
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.sales-by-brands {
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

.date-picker {
  width: 200px;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
  background-color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-select {
  width: 200px;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.chart-container {
  position: relative;
  height: 400px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.chart-loading {
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

.table-section {
  margin-top: 1rem;
}

.change-value {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.change-value.positive {
  color: #10B981;
}

.change-value.negative {
  color: #EF4444;
}

.change-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  background-color: #F3F4F6;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1F2937;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #E5E7EB;
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
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .filter-actions {
    margin-left: 0;
    margin-top: 1rem;
  }
  
  .chart-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>