<template>
  <div class="feedback-status-view">
    <div class="page-header">
      <h1>{{ $t('feedback.title') }}</h1>
      <div class="header-controls">
        <DatePicker v-model="selectedDate" class="date-picker" />
      </div>
    </div>
    
    <div class="kanban-board">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="!hasItems" class="empty-state">
        <ClipboardList class="empty-icon" />
        <p>{{ $t('common.noData') }}</p>
        <button @click="generateMockData" class="btn-primary">
          {{ $t('common.refresh') }}
        </button>
      </div>
      
      <div v-else class="kanban-container">
        <div 
          v-for="column in kanbanColumns" 
          :key="column.id"
          class="kanban-column"
        >
          <div class="column-header">
            <h2>{{ $t(column.titleKey) }}</h2>
            <div class="item-count">{{ getColumnItems(column.id).length }}</div>
          </div>
          
          <div class="column-content">
            <div 
              v-for="item in getColumnItems(column.id)"
              :key="item.id"
              class="kanban-item"
              draggable="true"
              @dragstart="dragStart($event, item)"
              @dragover.prevent
              @drop="onDrop($event, column.id)"
            >
              <div class="item-header">
                <h3 class="item-client">{{ item.client }}</h3>
                <div class="item-date">{{ formatDate(item.date) }}</div>
              </div>
              
              <div class="item-subject">{{ item.subject }}</div>
              
              <div v-if="item.volume" class="item-volume">
                {{ $t('feedback.volume') }}: <span>{{ item.volume }}</span>
              </div>
              
              <div class="item-notes" v-if="item.notes">
                <p>{{ item.notes }}</p>
              </div>
              
              <div class="item-actions">
                <button @click="openNoteModal(item)" class="action-btn">
                  <PenSquare class="action-icon" />
                </button>
                <button @click="setItemStatus(item, 'pending')" v-if="item.status !== 'pending'" class="status-btn pending">
                  {{ $t('feedback.pending') }}
                </button>
                <button @click="setItemStatus(item, 'received')" v-if="item.status !== 'received'" class="status-btn received">
                  {{ $t('feedback.received') }}
                </button>
                <button @click="setItemStatus(item, 'partial')" v-if="item.status !== 'partial'" class="status-btn partial">
                  {{ $t('feedback.partial') }}
                </button>
              </div>
            </div>
            
            <div 
              v-if="getColumnItems(column.id).length === 0"
              class="empty-column"
              @dragover.prevent
              @drop="onDrop($event, column.id)"
            >
              {{ $t('common.dragHere') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Note Modal -->
    <Modal 
      v-model="showNoteModal" 
      :title="$t('feedback.addNote')"
      showDefaultFooter
      :cancelText="$t('common.cancel')"
      :confirmText="$t('common.save')"
      @confirm="saveNote"
    >
      <div class="modal-form">
        <div class="form-group">
          <label>{{ $t('feedback.client') }}</label>
          <div class="input-readonly">{{ selectedItem?.client || '-' }}</div>
        </div>
        <div class="form-group">
          <label>{{ $t('feedback.subject') }}</label>
          <div class="input-readonly">{{ selectedItem?.subject || '-' }}</div>
        </div>
        <div class="form-group">
          <label>{{ $t('feedback.date') }}</label>
          <DatePicker v-model="noteDate" class="date-picker" />
        </div>
        <div class="form-group">
          <label>{{ $t('common.notes') }}</label>
          <textarea 
            v-model="noteText" 
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClipboardList, PenSquare } from 'lucide-vue-next'
import DatePicker from '@/components/ui/DatePicker.vue'
import Modal from '@/components/ui/Modal.vue'

const route = useRoute()
const { t } = useI18n()
const loading = ref(true)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const feedbackItems = ref([])
const showNoteModal = ref(false)
const selectedItem = ref(null)
const noteText = ref('')
const noteDate = ref(new Date().toISOString().split('T')[0])
const draggedItem = ref(null)

// Column definitions
const kanbanColumns = [
  { id: 'pending', titleKey: 'feedback.pending' },
  { id: 'received', titleKey: 'feedback.received' },
  { id: 'partial', titleKey: 'feedback.partial' }
]

// Get items for a specific column
const getColumnItems = (columnId) => {
  return feedbackItems.value.filter(item => item.status === columnId)
}

// Check if there are any items
const hasItems = computed(() => {
  return feedbackItems.value.length > 0
})

// Watch for query parameter to filter by client
watch(() => route.query.client, (newClient) => {
  if (newClient) {
    // In a real app, this would fetch data filtered by client
    // For now, let's just filter the existing data
    setTimeout(() => {
      generateMockData(newClient)
    }, 500)
  }
}, { immediate: true })

// Generate static data
const generateMockData = () => {
  loading.value = true
  
  setTimeout(() => {
    // Static predefined data
    feedbackItems.value = [
      {
        id: 1,
        client: '明斯克汽车',
        subject: '规格说明 AITO M5',
        date: '2025-04-01',
        status: 'received',
        volume: 827,
        notes: '等待上海办公室回复'
      },
      {
        id: 2,
        client: '莫斯科汽车',
        subject: '2025年第一季度销量 (BYD)',
        date: '2025-03-25',
        status: 'pending',
        volume: 542,
        notes: ''
      },
      {
        id: 3,
        client: '圣彼得堡汽车',
        subject: '新本地化请求 Avatr',
        date: '2025-04-15',
        status: 'partial',
        volume: 310,
        notes: '等待上海办公室回复'
      },
      {
        id: 4,
        client: '阿拉木图汽车',
        subject: '价格更新 Chery 和 Geely',
        date: '2025-04-10',
        status: 'received',
        volume: 650,
        notes: ''
      },
      {
        id: 5,
        client: '塔什干汽车',
        subject: '年度交付计划 Haval 2025',
        date: '2025-03-30',
        status: 'pending',
        volume: 420,
        notes: '等待上海办公室回复'
      },
      {
        id: 6,
        client: '上海港口',
        subject: '规格说明 AITO M7',
        date: '2025-04-05',
        status: 'partial',
        volume: 780,
        notes: ''
      },
      {
        id: 7,
        client: '广州港口',
        subject: '价格更新 BYD 和 NIO',
        date: '2025-04-20',
        status: 'received',
        volume: 930,
        notes: '等待上海办公室回复'
      },
      {
        id: 8,
        client: '符拉迪沃斯托克汽车',
        subject: '2025年第二季度销量',
        date: '2025-04-12',
        status: 'pending',
        volume: 560,
        notes: ''
      },
      {
        id: 9,
        client: '叶卡捷琴堡汽车',
        subject: '新本地化请求 Li Auto',
        date: '2025-04-08',
        status: 'received',
        volume: 480,
        notes: '等待上海办公室回复'
      }
    ];
    
    loading.value = false
  }, 800)
}

// Format date for display
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Drag and drop handlers
const dragStart = (event, item) => {
  draggedItem.value = item
  event.dataTransfer.effectAllowed = 'move'
  
  // Create a custom ghost image for better drag feedback
  const ghost = event.target.cloneNode(true)
  ghost.style.position = 'absolute'
  ghost.style.top = '-1000px'
  ghost.style.opacity = '0.5'
  document.body.appendChild(ghost)
  event.dataTransfer.setDragImage(ghost, 0, 0)
  
  // Schedule ghost removal
  setTimeout(() => {
    document.body.removeChild(ghost)
  }, 0)
}

const onDrop = (event, columnId) => {
  event.preventDefault()
  if (draggedItem.value) {
    // Update the status of the dragged item
    const index = feedbackItems.value.findIndex(item => item.id === draggedItem.value.id)
    if (index !== -1) {
      feedbackItems.value[index].status = columnId
      draggedItem.value = null
    }
  }
}

// Note modal handlers
const openNoteModal = (item) => {
  selectedItem.value = item
  noteText.value = item.notes || ''
  noteDate.value = item.date
  showNoteModal.value = true
}

const saveNote = () => {
  if (selectedItem.value) {
    const index = feedbackItems.value.findIndex(item => item.id === selectedItem.value.id)
    if (index !== -1) {
      feedbackItems.value[index].notes = noteText.value
      feedbackItems.value[index].date = noteDate.value
    }
  }
  showNoteModal.value = false
}

// Update item status directly
const setItemStatus = (item, status) => {
  const index = feedbackItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    feedbackItems.value[index].status = status
  }
}

onMounted(() => {
  console.log('Component mounted, generating mock data');
  // Всегда генерировать данные при загрузке
  generateMockData()
})
</script>

<style scoped>
.feedback-status-view {
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

.kanban-board {
  position: relative;
  min-height: 600px;
  background-color: #F3F4F6;
  border-radius: 0.75rem;
  padding: 1rem;
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
  border-radius: 0.75rem;
  z-index: 10;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #F3F4F6;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 500px;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #9CA3AF;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1rem;
  color: #6B7280;
  margin: 0 0 1.5rem 0;
}

.btn-primary {
  padding: 0.625rem 1rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563EB;
}

.kanban-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  height: 100%;
}

.kanban-column {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #1F2937;
  color: white;
}

.column-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.item-count {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.column-content {
  padding: 1rem;
  flex: 1;
  min-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.kanban-item {
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kanban-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.kanban-item:active {
  cursor: grabbing;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.item-client {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.item-date {
  font-size: 0.75rem;
  color: #6B7280;
}

.item-subject {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.item-volume {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #4B5563;
}

.item-volume span {
  font-weight: 600;
}

.item-notes {
  padding: 0.5rem;
  background-color: #F3F4F6;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #4B5563;
  margin-bottom: 0.5rem;
}

.item-notes p {
  margin: 0;
}

.item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
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

.action-icon {
  width: 1rem;
  height: 1rem;
  color: #4B5563;
}

.status-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-btn.pending {
  background-color: #FEF3C7;
  color: #92400E;
}

.status-btn.pending:hover {
  background-color: #FDE68A;
}

.status-btn.received {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-btn.received:hover {
  background-color: #A7F3D0;
}

.status-btn.partial {
  background-color: #DBEAFE;
  color: #1E40AF;
}

.status-btn.partial:hover {
  background-color: #BFDBFE;
}

.empty-column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #E5E7EB;
  border-radius: 0.5rem;
  color: #9CA3AF;
  font-size: 0.875rem;
  padding: 2rem;
  text-align: center;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1279px) {
  .kanban-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .column-content {
    min-height: 300px;
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
}
</style>
