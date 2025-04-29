<template>
  <div class="order-details">
    <div class="page-header">
      <h1>{{ $t('orderDetails.title') }}</h1>
      <div class="header-controls">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="search-input" 
            :placeholder="$t('common.search')"
          />
          <Search class="search-icon" />
        </div>
      </div>
    </div>
    
    <div class="filters">
      <Select
        v-model="filters.brand"
        :options="brandOptions"
        :label="$t('orderDetails.brand')"
        class="filter-select"
      />
      <Select
        v-model="filters.year"
        :options="yearOptions"
        :label="$t('orderDetails.year')"
        class="filter-select"
      />
      <Select
        v-model="filters.status"
        :options="statusOptions"
        :label="$t('orderDetails.status')"
        class="filter-select"
      />
      <div class="filter-actions">
        <button @click="resetFilters" class="btn-cancel">
          {{ $t('common.reset') }}
        </button>
        <button @click="applyFilters" class="btn-accent">
          {{ $t('common.filter') }}
        </button>
      </div>
    </div>
    
    <div class="table-section">
      <Table
        :columns="tableColumns"
        :data="filteredOrders"
        :loading="loading"
        paginated
        :itemsPerPage="10"
      >
        <template #cell-languages="{ value }">
          <div class="languages-list">
            <div 
              v-for="(lang, index) in value" 
              :key="index"
              class="language-tag"
            >
              {{ lang }}
            </div>
            <button v-if="value.length > 3" class="more-tag">
              +{{ value.length - 3 }}
            </button>
          </div>
        </template>
        <template #cell-status="{ value }">
          <div :class="['status-badge', `status-${value.toLowerCase()}`]">
            {{ value }}
          </div>
        </template>
        <template #cell-actions="{ row }">
          <div class="actions-container">
            <button 
              @click="openVolumeModal(row)"
              class="action-btn"
              :title="$t('orderDetails.clarifyVolume')"
            >
              <FilePlus class="action-icon" />
            </button>
            <button 
              @click="contactViaWeChat(row)"
              class="action-btn wechat"
              :title="$t('common.contactVia') + ' WeChat'"
            >
              <MessageSquare class="action-icon" />
            </button>
            <button 
              @click="contactViaTelegram(row)"
              class="action-btn telegram"
              :title="$t('common.contactVia') + ' Telegram'"
            >
              <Send class="action-icon" />
            </button>
          </div>
        </template>
      </Table>
    </div>
    
    <!-- Volume Clarification Modal -->
    <Modal 
      v-model="showVolumeModal" 
      :title="$t('modal.clarifyVolume.title')"
      showDefaultFooter
      :cancelText="$t('common.cancel')"
      :confirmText="$t('modal.clarifyVolume.submit')"
      @confirm="submitVolumeRequest"
    >
      <div class="modal-form">
        <div class="form-group">
          <label>{{ $t('modal.clarifyVolume.currentVolume') }}</label>
          <div class="input-readonly">{{ selectedOrder?.volume || '-' }}</div>
        </div>
        <div class="form-group">
          <label>{{ $t('modal.clarifyVolume.newVolume') }}</label>
          <input 
            v-model="newVolume" 
            type="number" 
            min="1"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>{{ $t('modal.clarifyVolume.comment') }}</label>
          <textarea 
            v-model="volumeComment" 
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, FilePlus, MessageSquare, Send } from 'lucide-vue-next'
import Select from '@/components/ui/Select.vue'
import Table from '@/components/ui/Table.vue'
import Modal from '@/components/ui/Modal.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const searchQuery = ref('')
const orders = ref([])
const showVolumeModal = ref(false)
const selectedOrder = ref(null)
const newVolume = ref('')
const volumeComment = ref('')

// Initialize filters from route query params
const initFilters = () => {
  return {
    brand: route.query.brand || '',
    model: route.query.model || '',
    year: route.query.year || '',
    status: route.query.status || ''
  }
}

const filters = ref(initFilters())

// Watch for route changes to update filters
watch(() => route.query, (newQuery) => {
  if (newQuery.brand || newQuery.model) {
    filters.value = initFilters()
  }
}, { immediate: true })

// Options for the filters
const brandOptions = computed(() => [
  { value: '', label: t('regions.all') },
  { value: 'BYD', label: 'BYD' },
  { value: 'AITO', label: 'AITO' },
  { value: 'Avatr', label: 'Avatr' },
  { value: 'Chery', label: 'Chery' },
  { value: 'Geely', label: 'Geely' },
  { value: 'Great Wall', label: 'Great Wall' },
  { value: 'Changan', label: 'Changan' },
  { value: 'FAW', label: 'FAW' },
  { value: 'BAIC', label: 'BAIC' },
  { value: 'Haval', label: 'Haval' }
])

const yearOptions = computed(() => [
  { value: '', label: t('years.all') },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' }
])

const statusOptions = computed(() => [
  { value: '', label: t('feedback.all') || 'Все статусы' },
  { value: 'New', label: t('feedback.new') || 'Новый' },
  { value: 'InProgress', label: t('feedback.inProgress') || 'В работе' },
  { value: 'Pending', label: t('feedback.pending') },
  { value: 'Completed', label: t('feedback.completed') || 'Завершен' }
])

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Table columns
const tableColumns = computed(() => [
  { key: 'orderNumber', label: t('orderDetails.orderNumber'), sortable: true },
  { key: 'brand', label: t('orderDetails.brand'), sortable: true },
  { key: 'model', label: t('orderDetails.model'), sortable: true },
  { key: 'year', label: t('orderDetails.year'), sortable: true },
  { key: 'client', label: t('orderDetails.client'), sortable: true },
  { key: 'languages', label: t('orderDetails.languages') },
  { key: 'volume', label: t('orderDetails.volume'), sortable: true },
  { key: 'status', label: t('orderDetails.status'), sortable: true },
  { key: 'actions', label: t('orderDetails.actions') }
])

// Generate mock orders data
const generateOrders = () => {
  const mockOrders = []
  const brands = ['BYD', 'AITO', 'Avatr', 'Chery', 'Geely', 'Great Wall', 'Changan', 'FAW', 'BAIC', 'Haval']
  const models = {
    'BYD': ['Han', 'Tang', 'Song Plus', 'Seal', 'Dolphin', 'Atto 3'],
    'AITO': ['M5', 'M7', 'M9'],
    'Avatr': ['11', '12'],
    'Chery': ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 5', 'Tiggo 4 Pro'],
    'Geely': ['Coolray', 'Atlas Pro', 'Tugella', 'Monjaro'],
    'Great Wall': ['Wingle 7', 'Poer', 'Cannon'],
    'Changan': ['CS55', 'CS75', 'UNI-T', 'UNI-K'],
    'FAW': ['Bestune T77', 'Bestune T99', 'Hongqi H5', 'Hongqi E-HS9'],
    'BAIC': ['X7', 'BJ40', 'EU5', 'EX5'],
    'Haval': ['F7', 'H6', 'H9', 'Jolion']
  }
  const clients = [
    'Москва-Авто', 
    'СПб-Моторс', 
    'НовосибирскТрейд', 
    'Владивосток-Авто', 
    'Екатеринбург-Карс',
    'Минск-Моторс',
    'Алматы-Авто',
    'Ташкент-Авто',
    'Баку-Моторс',
    'Киев-Трейд'
  ]
  const languages = [
    'Русский', 
    'Английский', 
    'Китайский', 
    'Казахский', 
    'Узбекский',
    'Украинский',
    'Белорусский',
    'Грузинский',
    'Азербайджанский'
  ]
  const statuses = ['New', 'InProgress', 'Pending', 'Completed']
  
  for (let i = 1; i <= 50; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const brandModels = models[brand]
    const model = brandModels[Math.floor(Math.random() * brandModels.length)]
    const year = 2020 + Math.floor(Math.random() * 6)
    
    const numLanguages = 1 + Math.floor(Math.random() * 4)
    const orderLanguages = []
    for (let j = 0; j < numLanguages; j++) {
      const lang = languages[Math.floor(Math.random() * languages.length)]
      if (!orderLanguages.includes(lang)) {
        orderLanguages.push(lang)
      }
    }
    
    mockOrders.push({
      id: i,
      orderNumber: `ORD-${10000 + i}`,
      brand,
      model,
      year: year.toString(),
      client: clients[Math.floor(Math.random() * clients.length)],
      languages: orderLanguages,
      volume: 100 + Math.floor(Math.random() * 900),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }
  
  return mockOrders
}

// Filter orders based on search query and filters
const filteredOrders = computed(() => {
  if (!orders.value.length) return []
  
  return orders.value.filter(order => {
    // Search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const searchIn = [
        order.orderNumber,
        order.brand,
        order.model,
        order.client
      ].map(val => (val || '').toLowerCase())
      
      if (!searchIn.some(val => val.includes(query))) {
        return false
      }
    }
    
    // Apply filters
    if (filters.value.brand && order.brand !== filters.value.brand) {
      return false
    }
    
    if (filters.value.model && order.model !== filters.value.model) {
      return false
    }
    
    if (filters.value.year && order.year !== filters.value.year) {
      return false
    }
    
    if (filters.value.status && order.status !== filters.value.status) {
      return false
    }
    
    return true
  })
})

// Filter handlers
const applyFilters = () => {
  // Update URL query params
  router.push({
    query: {
      ...route.query,
      brand: filters.value.brand || undefined,
      model: filters.value.model || undefined,
      year: filters.value.year || undefined,
      status: filters.value.status || undefined
    }
  })
}

const resetFilters = () => {
  filters.value = {
    brand: '',
    model: '',
    year: '',
    status: ''
  }
  
  // Remove filter params from URL
  router.push({
    query: {}
  })
}

// Modal handlers
const openVolumeModal = (order) => {
  selectedOrder.value = order
  newVolume.value = order.volume
  volumeComment.value = ''
  showVolumeModal.value = true
}

const submitVolumeRequest = () => {
  console.log('Volume request submitted', {
    order: selectedOrder.value,
    newVolume: newVolume.value,
    comment: volumeComment.value
  })
  
  // In a real app, this would send a request to the backend
  // For now, let's update the local order
  if (selectedOrder.value) {
    const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (index !== -1) {
      orders.value[index].volume = newVolume.value
      orders.value[index].status = 'Pending' // Change status to pending
    }
  }
  
  // Close modal
  showVolumeModal.value = false
  
  // Show success message (in a real app, use a proper toast notification)
  alert(volumeComment.value)
}

// Contact actions
const contactViaWeChat = (order) => {
  console.log('Contact via WeChat', order)
  // In a real app, this would open WeChat or a form to send a WeChat message
}

const contactViaTelegram = (order) => {
  console.log('Contact via Telegram', order)
  // In a real app, this would open Telegram or a form to send a Telegram message
}

onMounted(() => {
  // Simulate loading data from an API
  setTimeout(() => {
    orders.value = generateOrders()
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.order-details {
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

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6B7280;
  pointer-events: none;
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

.btn-cancel {
  padding: 0.625rem 1rem;
  background-color: #F3F4F6;
  color: #4B5563;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #E5E7EB;
}

.btn-accent {
  padding: 0.625rem 1rem;
  background-color: #F59E0B;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-accent:hover {
  background-color: #D97706;
}

.table-section {
  margin-top: 1rem;
}

.languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.language-tag {
  padding: 0.125rem 0.375rem;
  background-color: #F3F4F6;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.more-tag {
  padding: 0.125rem 0.375rem;
  background-color: #E5E7EB;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  min-width: 6rem;
}

.status-new {
  background-color: #DBEAFE;
  color: #1E40AF;
}

.status-inprogress {
  background-color: #FEF3C7;
  color: #92400E;
}

.status-pending {
  background-color: #FEE2E2;
  color: #B91C1C;
}

.status-completed {
  background-color: #D1FAE5;
  color: #065F46;
}

.actions-container {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: #F3F4F6;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #E5E7EB;
}

.action-btn.wechat {
  background-color: #7BBB4A;
  color: white;
}

.action-btn.wechat:hover {
  background-color: #6AA33E;
}

.action-btn.telegram {
  background-color: #0088CC;
  color: white;
}

.action-btn.telegram:hover {
  background-color: #0077B5;
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input-readonly {
  padding: 0.625rem 0.75rem;
  background-color: #F3F4F6;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6B7280;
}

.form-input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-textarea {
  padding: 0.625rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-controls {
    width: 100%;
  }
  
  .search-container {
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
}
</style>
