<template>
  <div class="comparison-chart">
    <div v-if="loading" class="chart-loading">
      <div class="loading-spinner"></div>
    </div>
    <v-chart v-else :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components'
import VChart from 'vue-echarts'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent
])

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'bar',
    validator: (value) => ['bar', 'line'].includes(value)
  },
  categories: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']
  }
})

const chartOption = computed(() => {
  if (props.type === 'bar') {
    return {
      title: {
        text: props.title,
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          let result = `${params[0].name}<br/>`
          params.forEach(param => {
            // Add color indicator and format numbers with commas
            result += `${param.marker} ${param.seriesName}: <strong>${param.value.toLocaleString()}</strong><br/>`
          })
          return result
        }
      },
      legend: {
        data: props.data.map(item => item.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        top: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: props.categories,
        axisLabel: {
          rotate: props.categories.length > 6 ? 45 : 0,
          hideOverlap: true
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => value.toLocaleString()
        }
      },
      series: props.data.map((item, index) => ({
        name: item.name,
        type: 'bar',
        data: item.data,
        itemStyle: {
          color: props.colors[index % props.colors.length]
        }
      })),
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: props.categories.length > 10,
          start: 0,
          end: 100
        }
      ]
    }
  } else {
    return {
      title: {
        text: props.title,
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let result = `${params[0].name}<br/>`
          params.forEach(param => {
            // Add color indicator and format numbers with commas
            result += `${param.marker} ${param.seriesName}: <strong>${param.value.toLocaleString()}</strong><br/>`
          })
          return result
        }
      },
      legend: {
        data: props.data.map(item => item.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        top: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.categories
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => value.toLocaleString()
        }
      },
      series: props.data.map((item, index) => ({
        name: item.name,
        type: 'line',
        data: item.data,
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: props.colors[index % props.colors.length]
        },
        areaStyle: item.showArea ? {
          opacity: 0.2
        } : undefined
      })),
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: props.categories.length > 10,
          start: 0,
          end: 100
        }
      ]
    }
  }
})
</script>

<style scoped>
.comparison-chart {
  width: 100%;
  height: 100%;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
