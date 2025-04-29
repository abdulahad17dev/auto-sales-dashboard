<template>
  <div class="sales-by-years">
    <div class="page-header">
      <h1>{{ $t('salesByYears.title') }}</h1>
      <div class="header-controls">
        <button @click="exportCsv" class="export-btn">
          <FileDown class="icon" />
          {{ $t('salesByYears.exportCsv') }}
        </button>
      </div>
    </div>

    <div class="year-range-selector">
      <div class="selector-header">
        <h3>{{ $t('salesByYears.yearRange') }}</h3>
        <div class="selected-range">
          {{ yearRange[0] }} - {{ yearRange[1] }}
        </div>
      </div>
      <div class="range-slider-container">
        <div class="range-slider">
          <input 
            type="range" 
            class="min-range"
            :min="minYear" 
            :max="maxYear"
            :value="yearRange[0]"
            @input="updateMinYear"
          >
          <input 
            type="range" 
            class="max-range"
            :min="minYear" 
            :max="maxYear"
            :value="yearRange[1]"
            @input="updateMaxYear"
          >
        </div>
        <div class="range-labels">
          <span class="min-label">{{ minYear }}</span>
          <span class="max-label">{{ maxYear }}</span>
        </div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-wrapper">
        <h3>{{ $t('salesByYears.deals') }}</h3>
        <div v-if="loading" class="chart-loading">
          <div class="loading-spinner"></div>
        </div>
        <v-chart v-else :option="dealsChartOption" autoresize />
      </div>
      
      <div class="chart-wrapper">
        <h3>{{ $t('salesByYears.averageCheck') }}</h3>
        <div v-if="loading" class="chart-loading">
          <div class="loading-spinner"></div>
        </div>
        <v-chart v-else :option="avgCheckChartOption" autoresize />
      </div>
    </div>
    
    <div class="summary-cards">
      <div v-for="(card, index) in summaryCards" :key="index" class="summary-card">
        <div class="card-header">
          <component :is="card.icon" class="card-icon" />
          <h3 class="card-title">{{ card.title }}</h3>
        </div>
        <div class="card-value">{{ card.value }}</div>
        <div :class="['card-change', card.change >= 0 ? 'positive' : 'negative']">
          <component :is="card.change >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
          {{ Math.abs(card.change) }}%
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
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, MarkLineComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { FileDown, TrendingUp, TrendingDown, Calendar, DollarSign, ShoppingCart, BarChart } from 'lucide-vue-next'

// Register ECharts components
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent
])

const { t } = useI18n()

const loading = ref(true)
const minYear = 2015
const maxYear = 2025
const yearRange = ref([2018, 2025])

// Mock data for the years
const generateYearlyData = () => {
  const years = []
  const deals = []
  const avgCheck = []
  
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year)
    
    // Generate random data with an upward trend for Chinese car brands
    const baseDeals = 300 + (year - minYear) * 80  // Steeper growth for Chinese brands
    const dealVariation = Math.random() * 120 - 40  // More variation
    deals.push(Math.round(baseDeals + dealVariation))
    
    const baseAvgCheck = 2000 + (year - minYear) * 150  // Higher average check for these brands
    const checkVariation = Math.random() * 400 - 150
    avgCheck.push(Math.round(baseAvgCheck + checkVariation))
  }
  
  return { years, deals, avgCheck }
}

const yearlyData = generateYearlyData()

// Filtered data based on the selected range
const filteredData = computed(() => {
  const startIndex = yearlyData.years.indexOf(yearRange.value[0])
  const endIndex = yearlyData.years.indexOf(yearRange.value[1])
  
  return {
    years: yearlyData.years.slice(startIndex, endIndex + 1),
    deals: yearlyData.deals.slice(startIndex, endIndex + 1),
    avgCheck: yearlyData.avgCheck.slice(startIndex, endIndex + 1)
  }
})

// Chart options
const dealsChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => `${params[0].name}: ${params[0].value} ${t('salesByYears.deals')}`
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: filteredData.value.years
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: t('salesByYears.deals'),
        type: 'line',
        data: filteredData.value.deals,
        smooth: true,
        showSymbol: true,
        symbolSize: 8,
        itemStyle: {
          color: '#3B82F6'
        },
        lineStyle: {
          width: 3
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
        markLine: {
          data: [
            {
              type: 'average',
              name: t('salesByYears.average'),
              lineStyle: {
                color: '#F59E0B',
                type: 'dashed'
              }
            }
          ]
        }
      }
    ]
  }
})

const avgCheckChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => `${params[0].name}: ${params[0].value}`
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: filteredData.value.years
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [
      {
        name: t('salesByYears.averageCheck'),
        type: 'line',
        data: filteredData.value.avgCheck,
        smooth: true,
        showSymbol: true,
        symbolSize: 8,
        itemStyle: {
          color: '#F59E0B'
        },
        lineStyle: {
          width: 3
        },
        markLine: {
          data: [
            {
              type: 'average',
              name: t('salesByYears.average'),
              lineStyle: {
                color: '#3B82F6',
                type: 'dashed'
              }
            }
          ]
        }
      }
    ]
  }
})

// Summary cards data
const summaryCards = computed(() => [
  {
    title: t('salesByYears.totalDeals'),
    value: '12,863',
    change: 18.7,
    icon: ShoppingCart
  },
  {
    title: t('salesByYears.averageCheck'),
    value: '$3,120',
    change: 9.2,
    icon: DollarSign
  },
  {
    title: t('salesByYears.mostPopularYear'),
    value: '2024',
    change: 4.5,
    icon: Calendar
  },
  {
    title: t('salesByYears.totalRevenue'),
    value: '$35.2M',
    change: 22.3,
    icon: BarChart
  }
])

// Range slider handlers
const updateMinYear = (event) => {
  const minVal = parseInt(event.target.value)
  if (minVal < yearRange.value[1]) {
    yearRange.value = [minVal, yearRange.value[1]]
  }
}

const updateMaxYear = (event) => {
  const maxVal = parseInt(event.target.value)
  if (maxVal > yearRange.value[0]) {
    yearRange.value = [yearRange.value[0], maxVal]
  }
}

// Export CSV function
const exportCsv = () => {
  // In a real app, this would generate and download a CSV file
  console.log('Exporting CSV for year range:', yearRange.value)
  
  // Mock implementation of CSV export
  const csvData = filteredData.value.years.map((year, index) => {
    return {
      year,
      deals: filteredData.value.deals[index],
      avgCheck: filteredData.value.avgCheck[index]
    }
  })
  
  // Convert to CSV string
  const csvHeader = 'Year,Deals,Average Check\n'
  const csvContent = csvData.map(row => `${row.year},${row.deals},${row.avgCheck}`).join('\n')
  const csvString = csvHeader + csvContent
  
  // Create a download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `sales_by_years_${yearRange.value[0]}-${yearRange.value[1]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  // Simulate loading data from an API
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.sales-by-years {
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

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #2563EB;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.year-range-selector {
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.selector-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.selected-range {
  font-weight: 600;
  color: #3B82F6;
}

.range-slider-container {
  width: 100%;
  margin-top: 2rem;
}

.range-slider {
  position: relative;
  width: 100%;
  height: 5px;
  background-color: #E5E7EB;
  border-radius: 5px;
}

.min-range, .max-range {
  position: absolute;
  top: -5px;
  width: 100%;
  height: 15px;
  background: none;
  pointer-events: none;
  appearance: none;
  z-index: 10;
}

.min-range::-webkit-slider-thumb, .max-range::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #3B82F6;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.min-label, .max-label {
  font-size: 0.875rem;
  color: #6B7280;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.chart-wrapper {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: relative;
  height: 400px;
}

.chart-wrapper h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
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

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.summary-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3B82F6;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  color: #6B7280;
  font-weight: 500;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.card-change.positive {
  color: #10B981;
}

.card-change.negative {
  color: #EF4444;
}

.change-icon {
  width: 1rem;
  height: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1279px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
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
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .chart-wrapper {
    height: 300px;
  }
}
</style>
