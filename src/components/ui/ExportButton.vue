<template>
  <button 
    @click="exportData"
    class="export-button"
    :disabled="disabled || loading"
  >
    <FileDown v-if="!loading" class="icon" />
    <Loader v-else class="icon spinning" />
    {{ loading ? $t('common.exporting') : label }}
  </button>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { FileDown, Loader } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  filename: {
    type: String,
    default: 'export.csv'
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['export-success', 'export-error'])
const loading = ref(false)
const { t } = useI18n()

// Set default label using i18n if not provided
if (!props.label) {
  props.label = t('common.exportCsv')
}

const exportData = async () => {
  if (props.disabled || loading.value) return
  
  loading.value = true
  
  try {
    // Convert data to CSV
    const csvContent = convertToCSV(props.data)
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', props.filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    emit('export-success')
  } catch (error) {
    console.error('Error exporting data:', error)
    emit('export-error', error)
  } finally {
    loading.value = false
  }
}

const convertToCSV = (data) => {
  if (!data || !data.length) return ''
  
  // Get headers from first object's keys
  const headers = Object.keys(data[0])
  
  // Create CSV header row
  let csv = headers.join(',') + '\n'
  
  // Convert each data row to CSV
  data.forEach(item => {
    const row = headers.map(header => {
      // Get value for this header
      const value = item[header]
      
      // Handle different value types
      if (value === null || value === undefined) {
        return ''
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`
      } else {
        return value
      }
    })
    
    csv += row.join(',') + '\n'
  })
  
  return csv
}
</script>

<style scoped>
.export-button {
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

.export-button:hover:not(:disabled) {
  background-color: #2563EB;
}

.export-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
