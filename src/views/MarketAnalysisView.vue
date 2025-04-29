<template>
  <div class="market-analysis-view">
    <div class="page-header">
      <h1>{{ $t('marketAnalysis.title') }}</h1>
      <div class="header-controls">
        <DatePicker v-model="selectedYear" type="year" class="year-picker" />
      </div>
    </div>
    
    <div class="cards-grid">
      <div class="metric-card total-sales">
        <h3>{{ $t('marketAnalysis.totalSales') }}</h3>
        <div class="metric-value">{{ formatNumber(totalSales) }}</div>
        <div :class="['metric-change', totalSalesChange >= 0 ? 'positive' : 'negative']">
          <component :is="totalSalesChange >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
          {{ Math.abs(totalSalesChange) }}%
        </div>
      </div>
      
      <div class="metric-card market-share">
        <h3>{{ $t('marketAnalysis.marketShare') }}</h3>
        <div class="metric-value">{{ marketShare }}%</div>
        <div :class="['metric-change', marketShareChange >= 0 ? 'positive' : 'negative']">
          <component :is="marketShareChange >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
          {{ Math.abs(marketShareChange) }}%
        </div>
      </div>
      
      <div class="metric-card average-price">
        <h3>{{ $t('marketAnalysis.averagePrice') }}</h3>
        <div class="metric-value">${{ formatNumber(averagePrice) }}</div>
        <div :class="['metric-change', averagePriceChange >= 0 ? 'positive' : 'negative']">
          <component :is="averagePriceChange >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
          {{ Math.abs(averagePriceChange) }}%
        </div>
      </div>
      
      <div class="metric-card growth-rate">
        <h3>{{ $t('marketAnalysis.growthRate') }}</h3>
        <div class="metric-value">{{ growthRate }}%</div>
        <div :class="['metric-change', growthRateChange >= 0 ? 'positive' : 'negative']">
          <component :is="growthRateChange >= 0 ? 'TrendingUp' : 'TrendingDown'" class="change-icon" />
          {{ Math.abs(growthRateChange) }}%
        </div>
      </div>
    </div>
    
    <div class="charts-container">
      <div class="chart-block">
        <h2>{{ $t('marketAnalysis.salesByBrands') }}</h2>
        <div class="chart-wrapper">
          <ComparisonChart 
            :data="salesByBrandData" 
            :categories="months"
            type="line"
            :loading="loading"
          />
        </div>
      </div>
      
      <div class="chart-block">
        <h2>{{ $t('marketAnalysis.salesByRegions') }}</h2>
        <div class="chart-wrapper">
          <ComparisonChart 
            :data="salesByRegionData" 
            :categories="regions"
            :loading="loading"
          />
        </div>
      </div>
      
      <div class="chart-block wide">
        <h2>{{ $t('marketAnalysis.salesDistribution') }}</h2>
        <div class="chart-wrapper">
          <RegionHeatmap :loading="loading" />
        </div>
      </div>
      
      <div class="chart-block wide">
        <h2>{{ $t('marketAnalysis.marketShareByBrands') }}</h2>
        <div class="chart-wrapper">
          <div v-if="loading" class="chart-loading">
            <div class="loading-spinner"></div>
          </div>
          <v-chart v-else :option="marketShareOption" autoresize />
        </div>
      </div>
      
      <div class="chart-block wide">
        <h2>{{ $t('marketAnalysis.growthComparison') }}</h2>
        <div class="filters">
          <Select
            v-model="selectedBrand"
            :options="brandOptions"
            :label="$t('salesByBrands.brand')"
            class="filter-select"
          />
          <Select
            v-model="selectedRegion"
            :options="regionOptions"
            :label="$t('salesByBrands.region')"
            class="filter-select"
          />
        </div>
        <div class="chart-wrapper">
          <div v-if="loading" class="chart-loading">
            <div class="loading-spinner"></div>
          </div>
          <v-chart v-else :option="growthComparisonOption" autoresize />
        </div>
      </div>
    </div>
    
    <div class="market-trends">
      <h2>{{ $t('marketAnalysis.trends') }}</h2>
      <div class="trends-grid">
        <div class="trend-card">
          <UsersIcon class="trend-icon" />
          <h3>{{ $t('marketAnalysis.growingDemand') }}</h3>
          <p>{{ $t('marketAnalysis.demandGrowthText', { growth: demandGrowth }) }}</p>
        </div>
        
        <div class="trend-card">
          <ShoppingCartIcon class="trend-icon" />
          <h3>{{ $t('marketAnalysis.popularModels') }}</h3>
          <p>{{ $t('marketAnalysis.popularModelsText', { models: topModels.join(', ') }) }}</p>
        </div>
        
        <div class="trend-card">
          <BriefcaseIcon class="trend-icon" />
          <h3>{{ $t('marketAnalysis.businessSegment') }}</h3>
          <p>{{ $t('marketAnalysis.businessSegmentText', { growth: businessSegmentGrowth }) }}</p>
        </div>
        
        <div class="trend-card">
          <ZapIcon class="trend-icon" />
          <h3>{{ $t('marketAnalysis.electricVehicles') }}</h3>
          <p>{{ $t('marketAnalysis.evGrowthText', { growth: evGrowth, year: selectedYear }) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { TrendingUp, TrendingDown, Users as UsersIcon, ShoppingCart as ShoppingCartIcon, Briefcase as BriefcaseIcon, Zap as ZapIcon } from 'lucide-vue-next'
import DatePicker from '@/components/ui/DatePicker.vue'
import Select from '@/components/ui/Select.vue'
import ComparisonChart from '@/components/ui/ComparisonChart.vue'
import RegionHeatmap from '@/components/ui/RegionHeatmap.vue'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const { t } = useI18n()
const loading = ref(true)
const selectedYear = ref(new Date().getFullYear().toString())
const selectedBrand = ref('')
const selectedRegion = ref('')

// Mock data for metrics
const totalSales = ref(132450)
const totalSalesChange = ref(22.5)
const marketShare = ref(28.7)
const marketShareChange = ref(5.8)
const averagePrice = ref(24800)
const averagePriceChange = ref(3.2)
const growthRate = ref(31.5)
const growthRateChange = ref(7.6)

// Mock data for market trends
const demandGrowth = ref(34.2)
const topModels = ref(['BYD Han', 'Chery Tiggo 7 Pro', 'Geely Coolray', 'AITO M5'])
const businessSegmentGrowth = ref(19.8)
const evGrowth = ref(47.5)

// Filter options
const brandOptions = computed(() => [
  { value: '', label: t('salesByBrandsAndModels.allBrands') },
  { value: 'BYD', label: 'BYD' },
  { value: 'Chery', label: 'Chery' },
  { value: 'Geely', label: 'Geely' },
  { value: 'AITO', label: 'AITO' },
  { value: 'Great Wall', label: 'Great Wall' }
])

const regionOptions = computed(() => [
  { value: '', label: t('regions.all') },
  { value: 'russia', label: t('regions.russia') },
  { value: 'belarus', label: t('regions.belarus') },
  { value: 'kazakhstan', label: t('regions.kazakhstan') },
  { value: 'uzbekistan', label: t('regions.uzbekistan') },
  { value: 'other', label: t('regions.other') }
])

// Categories for charts
const months = computed(() => [
  t('months.jan'), t('months.feb'), t('months.mar'),
  t('months.apr'), t('months.may'), t('months.jun'),
  t('months.jul'), t('months.aug'), t('months.sep'),
  t('months.oct'), t('months.nov'), t('months.dec')
])

const regions = computed(() => [
  t('regions.russia'),
  t('regions.belarus'),
  t('regions.kazakhstan'),
  t('regions.uzbekistan'),
  t('regions.ukraine'),
  t('regions.azerbaijan')
])

// Generate data for sales by brand chart
const salesByBrandData = [
  {
    name: 'BYD',
    data: [1250, 1380, 1520, 1670, 1840, 2050, 2230, 2420, 2650, 2880, 3150, 3350],
    showArea: true
  },
  {
    name: 'Chery',
    data: [980, 1050, 1130, 1280, 1390, 1540, 1680, 1830, 1990, 2150, 2320, 2480],
    showArea: true
  },
  {
    name: 'Geely',
    data: [850, 920, 990, 1080, 1170, 1270, 1380, 1470, 1590, 1720, 1860, 1980],
    showArea: true
  },
  {
    name: 'AITO',
    data: [320, 390, 450, 520, 590, 680, 760, 850, 950, 1070, 1190, 1310],
    showArea: true
  },
  {
    name: 'Great Wall',
    data: [720, 780, 840, 910, 980, 1060, 1150, 1220, 1320, 1420, 1540, 1650],
    showArea: true
  }
]

// Generate data for sales by region chart
const salesByRegionData = [
  {
    name: 'BYD',
    data: [3350, 980, 720, 530, 420, 350]
  },
  {
    name: 'Chery',
    data: [2480, 1120, 680, 490, 380, 330]
  },
  {
    name: 'Geely',
    data: [1980, 870, 520, 420, 340, 290]
  },
  {
    name: 'AITO',
    data: [1310, 480, 320, 240, 180, 150]
  },
  {
    name: 'Great Wall',
    data: [1650, 590, 420, 310, 250, 210]
  }
]

// Pie chart for market share
const marketShareOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      data: ['BYD', 'Chery', 'Geely', 'Great Wall', 'AITO', t('regions.other')]
    },
    series: [
      {
        name: t('marketAnalysis.marketShare'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 28, name: 'BYD' },
          { value: 22, name: 'Chery' },
          { value: 18, name: 'Geely' },
          { value: 15, name: 'Great Wall' },
          { value: 8, name: 'AITO' },
          { value: 9, name: t('regions.other') }
        ]
      }
    ]
  }
})

// Bar chart for growth comparison
const growthComparisonOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['2024', '2025'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '2024',
        type: 'bar',
        data: [18.5, 22.3, 25.7, 28.2],
        itemStyle: {
          color: '#A7F3D0'
        }
      },
      {
        name: '2025',
        type: 'bar',
        data: [25.3, 31.5, 33.8, 35.2],
        itemStyle: {
          color: '#10B981'
        }
      }
    ]
  }
})

// Format number with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Load data
onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loading.value = false
  }, 1000)
})

// Watch for changes to selected year
watch(selectedYear, (newValue) => {
  loading.value = true
  
  // Simulate loading with new data
  setTimeout(() => {
    // Update metrics based on selected year
    const yearFactor = parseInt(newValue) - 2023;
    totalSales.value = Math.round(100000 * (1 + yearFactor * 0.15));
    totalSalesChange.value = 15 + Math.round(yearFactor * 2.5);
    
    marketShare.value = Math.round((20 + yearFactor * 3) * 10) / 10;
    marketShareChange.value = Math.round((3 + yearFactor * 0.8) * 10) / 10;
    
    averagePrice.value = Math.round(20000 * (1 + yearFactor * 0.08));
    averagePriceChange.value = Math.round((2 + yearFactor * 0.5) * 10) / 10;
    
    growthRate.value = Math.round((25 + yearFactor * 2) * 10) / 10;
    growthRateChange.value = Math.round((5 + yearFactor * 0.7) * 10) / 10;
    
    loading.value = false;
  }, 800)
})
</script>

<style scoped>
.market-analysis-view {
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

.year-picker {
  width: 180px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metric-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.metric-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #4B5563;
  font-weight: 500;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.metric-change.positive {
  color: #10B981;
}

.metric-change.negative {
  color: #EF4444;
}

.change-icon {
  width: 1rem;
  height: 1rem;
}

.metric-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.total-sales::after {
  background-color: #3B82F6;
}

.market-share::after {
  background-color: #F59E0B;
}

.average-price::after {
  background-color: #10B981;
}

.growth-rate::after {
  background-color: #8B5CF6;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-block {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.chart-block.wide {
  grid-column: span 2;
}

.chart-block h2 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.chart-wrapper {
  flex: 1;
  min-height: 350px;
  position: relative;
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

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-select {
  width: 180px;
}

.market-trends {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.market-trends h2 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.trend-card {
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.trend-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #3B82F6;
  margin-bottom: 1rem;
}

.trend-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.trend-card p {
  margin: 0;
  font-size: 0.875rem;
  color: #4B5563;
  line-height: 1.5;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1279px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-block.wide {
    grid-column: span 1;
  }
  
  .trends-grid {
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
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .trends-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
}
</style>
