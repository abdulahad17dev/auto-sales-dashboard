<template>
  <div class="contacts-view">
    <div class="page-header">
      <h1>{{ $t('contacts.title') }}</h1>
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
        v-model="selectedStatus"
        :options="statusOptions"
        :label="$t('contacts.status')"
        class="filter-select"
      />
      <div class="filter-actions">
        <button @click="applyFilters" class="btn-accent">
          {{ $t('common.filter') }}
        </button>
      </div>
    </div>
    
    <div class="contacts-grid">
      <div 
        v-for="contact in filteredContacts" 
        :key="contact.id"
        class="contact-card"
      >
        <div class="card-header">
          <h3 class="client-name">{{ contact.client }}</h3>
          <div :class="['status-badge', `status-${contact.status.toLowerCase()}`]">
            {{ contact.status }}
          </div>
        </div>
        
        <div class="contact-details">
          <div class="detail-item">
            <User class="detail-icon" />
            <span>{{ contact.contactPerson }}</span>
          </div>
          <div class="detail-item">
            <Phone class="detail-icon" />
            <span>{{ contact.phone }}</span>
          </div>
          <div class="detail-item">
            <Mail class="detail-icon" />
            <span>{{ contact.email }}</span>
          </div>
        </div>
        
        <div class="messengers">
          <h4>{{ $t('contacts.messenger') }}</h4>
          <div class="messenger-buttons">
            <button 
              v-if="contact.wechat"
              @click="openMessenger('wechat', contact)"
              class="messenger-btn wechat"
            >
              WeChat
            </button>
            <button 
              v-if="contact.telegram"
              @click="openMessenger('telegram', contact)"
              class="messenger-btn telegram"
            >
              Telegram
            </button>
          </div>
        </div>
        
        <div class="card-actions">
          <button @click="requestVolume(contact)" class="btn-request">
            {{ $t('contacts.requestVolume') }}
          </button>
          <button @click="viewFeedbackStatus(contact)" class="btn-view-status">
            {{ $t('contacts.viewStatus') }}
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-if="!loading && filteredContacts.length === 0" class="empty-state">
        <Users class="empty-icon" />
        <p>{{ $t('common.noData') }}</p>
      </div>
    </div>
    
    <!-- Volume Request Modal -->
    <Modal 
      v-model="showVolumeModal" 
      :title="$t('modal.requestVolume.title')"
      showDefaultFooter
      :cancelText="$t('common.cancel')"
      :confirmText="$t('modal.requestVolume.submit')"
      @confirm="submitVolumeRequest"
    >
      <div class="modal-form">
        <div class="form-group">
          <label>{{ $t('modal.requestVolume.client') }}</label>
          <div class="input-readonly">{{ selectedContact?.client || '-' }}</div>
        </div>
        <div class="form-group">
          <label>{{ $t('modal.requestVolume.contact') }}</label>
          <div class="input-readonly">{{ selectedContact?.contactPerson || '-' }}</div>
        </div>
        <div class="form-group">
          <label>{{ $t('modal.requestVolume.message') }}</label>
          <textarea 
            v-model="requestMessage" 
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>
        <div class="form-group">
          <label>{{ $t('modal.requestVolume.dueDate') }}</label>
          <DatePicker v-model="requestDueDate" class="date-picker" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Search, User, Phone, Mail, Users } from 'lucide-vue-next'
import Select from '@/components/ui/Select.vue'
import Modal from '@/components/ui/Modal.vue'
import DatePicker from '@/components/ui/DatePicker.vue'

const { t } = useI18n()

const router = useRouter()
const loading = ref(true)
const searchQuery = ref('')
const selectedStatus = ref('')
const contacts = ref([])
const showVolumeModal = ref(false)
const selectedContact = ref(null)
const requestMessage = ref('')
const requestDueDate = ref(new Date().toISOString().split('T')[0])

// Status options for filtering
const statusOptions = computed(() => [
  { value: '', label: t('feedback.all') },
  { value: 'Active', label: t('feedback.active') || 'Активные' },
  { value: 'Pending', label: t('feedback.pending') },
  { value: 'Inactive', label: t('feedback.inactive') || 'Неактивные' }
])

// Generate mock contacts data
const generateContacts = () => {
  const mockContacts = []
  const russianClients = [
    'Москва-Авто',
    'СПб-Моторс',
    'НовосибирскТрейд',
    'Владивосток-Авто',
    'Екатеринбург-Карс'
  ]
  
  const postUSSRClients = [
    'Минск-Моторс',
    'Алматы-Авто',
    'Ташкент-Авто',
    'Баку-Моторс',
    'Киев-Трейд'
  ]
  
  const chinesePorts = [
    'Шанхай Порт',
    'Гуанчжоу Порт',
    'Тяньцзинь Порт',
    'Щэньчжэнь Порт',
    'Нинбо Порт'
  ]
  
  const clients = [...russianClients, ...postUSSRClients, ...chinesePorts]
  
  const russianContacts = [
    'Иванов Александр',
    'Смирнова Елена',
    'Кузнецов Дмитрий',
    'Петрова Анна',
    'Соколов Сергей'
  ]
  
  const chineseContacts = [
    'Ли Вэй',
    'Чжан Ян',
    'Ван Сяо',
    'Чэнь Мин',
    'Сунь И'
  ]
  
  const contactPersons = [...russianContacts, ...chineseContacts]
  
  const statuses = ['Active', 'Pending', 'Inactive']
  const russianDomains = ['company.ru', 'mail.ru', 'business.ru', 'auto.ru', 'motors.ru']
  const chineseDomains = ['company.cn', '163.com', 'qq.com', 'sina.com', 'motors.cn']
  const domains = [...russianDomains, ...chineseDomains]
  
  for (let i = 1; i <= 20; i++) {
    const isChineseClient = i > 12 // Make some clients Chinese
    const client = clients[Math.floor(Math.random() * clients.length)]
    const contactPerson = contactPersons[Math.floor(Math.random() * contactPersons.length)]
    
    // Create email based on contact person and domain
    const cleanName = contactPerson.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const email = cleanName ? `${cleanName}@${domain}` : `contact${i}@${domain}`
    
    mockContacts.push({
      id: i,
      client,
      contactPerson,
      phone: isChineseClient ? `+86 ${Math.floor(Math.random() * 10000000000)}` : `+7 ${Math.floor(Math.random() * 10000000000)}`,
      email,
      wechat: isChineseClient || Math.random() > 0.5, // Chinese clients always have WeChat, others 50%
      telegram: Math.random() > 0.4, // 60% chance to have Telegram
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }
  
  return mockContacts
}

// Filter contacts based on search and status filter
const filteredContacts = computed(() => {
  if (!contacts.value.length) return []
  
  return contacts.value.filter(contact => {
    // Search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const searchIn = [
        contact.client,
        contact.contactPerson,
        contact.email,
        contact.phone
      ].map(val => (val || '').toLowerCase())
      
      if (!searchIn.some(val => val.includes(query))) {
        return false
      }
    }
    
    // Status filter
    if (selectedStatus.value && contact.status !== selectedStatus.value) {
      return false
    }
    
    return true
  })
})

const applyFilters = () => {
  // This would apply the filters and potentially update URL params
  // For now, it's already handled by the computed property
}

const openMessenger = (type, contact) => {
  console.log(`Opening ${type} with`, contact)
  // In a real app, this would open the messenger or a form to send a message
}

const requestVolume = (contact) => {
  selectedContact.value = contact
  requestMessage.value = t('modal.requestVolume.defaultMessage', { 
    models: '[' + t('salesByBrandsAndModels.model') + ' 1], [' + t('salesByBrandsAndModels.model') + ' 2]' 
  }) || `Hello!\n\nPlease provide sales volume information for the following models:\n- [Model 1]\n- [Model 2]\n\nRegards,\n[Your name]`
  showVolumeModal.value = true
}

const submitVolumeRequest = () => {
  console.log('Volume request submitted', {
    contact: selectedContact.value,
    message: requestMessage.value,
    dueDate: requestDueDate.value
  })
  
  // In a real app, this would send a request to the backend
  // For now, let's update the local contact status
  if (selectedContact.value) {
    const index = contacts.value.findIndex(c => c.id === selectedContact.value.id)
    if (index !== -1) {
      contacts.value[index].status = 'Pending'
    }
  }
  
  // Close modal
  showVolumeModal.value = false
}

const viewFeedbackStatus = (contact) => {
  // Navigate to feedback status page
  router.push({
    path: '/feedback',
    query: { client: contact.client }
  })
}

onMounted(() => {
  // Simulate loading data from an API
  setTimeout(() => {
    contacts.value = generateContacts()
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.contacts-view {
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

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  position: relative;
}

.contact-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.client-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.status-active {
  background-color: #D1FAE5;
  color: #065F46;
}

.status-pending {
  background-color: #FEF3C7;
  color: #92400E;
}

.status-inactive {
  background-color: #F3F4F6;
  color: #6B7280;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-icon {
  width: 1rem;
  height: 1rem;
  color: #6B7280;
}

.messengers h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #4B5563;
}

.messenger-buttons {
  display: flex;
  gap: 0.5rem;
}

.messenger-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.messenger-btn.wechat {
  background-color: #7BBB4A;
  color: white;
}

.messenger-btn.wechat:hover {
  background-color: #6AA33E;
}

.messenger-btn.telegram {
  background-color: #0088CC;
  color: white;
}

.messenger-btn.telegram:hover {
  background-color: #0077B5;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.btn-request {
  padding: 0.625rem 1rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.btn-request:hover {
  background-color: #2563EB;
}

.btn-view-status {
  padding: 0.625rem 1rem;
  background-color: #F3F4F6;
  color: #4B5563;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.btn-view-status:hover {
  background-color: #E5E7EB;
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
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  margin: 0;
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
