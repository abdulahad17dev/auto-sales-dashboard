<template>
  <div class="table-container">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th 
            v-for="column in columns" 
            :key="column.key"
            :class="[
              column.class, 
              column.sortable ? 'sortable' : '', 
              sortBy === column.key ? 'active' : ''
            ]"
            @click="column.sortable ? sort(column.key) : null"
          >
            {{ column.label }}
            <div v-if="column.sortable" class="sort-icons">
              <ChevronUp :class="['sort-icon', sortBy === column.key && sortDir === 'asc' ? 'active' : '']" />
              <ChevronDown :class="['sort-icon', sortBy === column.key && sortDir === 'desc' ? 'active' : '']" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!loading && (!data || data.length === 0)">
          <td :colspan="columns.length" class="empty-message">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr 
          v-for="(row, index) in displayData" 
          :key="row.id || index"
          @click="$emit('row-click', row)"
          :class="{ 'clickable': clickable }"
        >
          <td 
            v-for="column in columns" 
            :key="`${row.id || index}-${column.key}`"
            :class="column.class"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="paginated && data.length > 0" class="pagination">
      <button 
        @click="prevPage" 
        class="pagination-button"
        :disabled="currentPage === 1"
      >
        <ChevronLeft class="pagination-icon" />
      </button>
      
      <span class="pagination-info">
        {{ $t('common.page') }} {{ currentPage }} {{ $t('common.of') }} {{ totalPages }}
      </span>
      
      <button 
        @click="nextPage" 
        class="pagination-button"
        :disabled="currentPage === totalPages"
      >
        <ChevronRight class="pagination-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'Нет данных'
  },
  paginated: {
    type: Boolean,
    default: false
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['row-click', 'sort'])

const currentPage = ref(1)
const sortBy = ref('')
const sortDir = ref('asc')

// Reset to page 1 when data changes
watch(() => props.data, () => {
  currentPage.value = 1
})

const totalPages = computed(() => {
  if (!props.data || props.data.length === 0) return 1
  return Math.ceil(props.data.length / props.itemsPerPage)
})

const sortedData = computed(() => {
  if (!sortBy.value) return [...props.data]
  
  return [...props.data].sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    
    if (aVal === bVal) return 0
    
    // Check if the values are numbers
    const aNum = Number(aVal)
    const bNum = Number(bVal)
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDir.value === 'asc' ? aNum - bNum : bNum - aNum
    }
    
    // String comparison
    const aStr = String(aVal || '')
    const bStr = String(bVal || '')
    
    return sortDir.value === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr)
  })
})

const displayData = computed(() => {
  if (!props.paginated) return sortedData.value
  
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  
  return sortedData.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const sort = (key) => {
  if (sortBy.value === key) {
    // Toggle direction if same column
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New column, default to ascending
    sortBy.value = key
    sortDir.value = 'asc'
  }
  
  emit('sort', { key, direction: sortDir.value })
}
</script>

<style scoped>
.table-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  -webkit-overflow-scrolling: touch; /* Improve mobile scrolling */
}

.table {
  width: 100%;
  min-width: 640px; /* Ensure table has minimum width on mobile */
  border-collapse: collapse;
}

.table th, .table td {
  padding: 0.75rem 1rem;
  text-align: left;
}

.table th {
  background-color: #1F2937;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table th:first-child {
  border-top-left-radius: 0.75rem;
}

.table th:last-child {
  border-top-right-radius: 0.75rem;
}

.table td {
  border-bottom: 1px solid #E5E7EB;
  white-space: nowrap; /* Prevent text wrapping in cells */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px; /* Limit cell width */
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:nth-child(even) {
  background-color: #F9FAFB;
}

.table tbody tr.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table tbody tr.clickable:hover {
  background-color: #F3F4F6;
}

.sortable {
  cursor: pointer;
  position: relative;
}

.sort-icons {
  display: inline-flex;
  flex-direction: column;
  margin-left: 0.25rem;
  vertical-align: middle;
}

.sort-icon {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 0.5;
}

.sort-icon.active {
  opacity: 1;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6B7280;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #F3F4F6;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-top: 1px solid #E5E7EB;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: white;
  border: 1px solid #D1D5DB;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #F3F4F6;
  border-color: #9CA3AF;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  width: 1rem;
  height: 1rem;
  color: #4B5563;
}

.pagination-info {
  margin: 0 1rem;
  font-size: 0.875rem;
  color: #4B5563;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
