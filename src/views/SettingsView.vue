<template>
  <div class="settings-view">
    <div class="page-header">
      <h1>{{ $t('navigation.settings') }}</h1>
    </div>
    
    <div class="settings-container">
      <div class="settings-section">
        <h2>{{ $t('settings.appearance') }}</h2>
        <div class="settings-option">
          <label class="settings-label">{{ $t('settings.theme') }}</label>
          <Select
            v-model="selectedTheme"
            :options="themeOptions"
            class="settings-select"
          />
        </div>
        <div class="settings-option">
          <label class="settings-label">{{ $t('settings.language') }}</label>
          <LocaleSelector mode="settings" />
        </div>
      </div>
      
      <div class="settings-section">
        <h2>{{ $t('settings.notifications') }}</h2>
        <div class="settings-option">
          <label class="toggle-label">
            <span>{{ $t('settings.emailNotifications') }}</span>
            <div class="toggle">
              <input type="checkbox" v-model="emailNotifications" />
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
        <div class="settings-option">
          <label class="toggle-label">
            <span>{{ $t('settings.browserNotifications') }}</span>
            <div class="toggle">
              <input type="checkbox" v-model="browserNotifications" />
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>{{ $t('settings.dataPreferences') }}</h2>
        <div class="settings-option">
          <label class="settings-label">{{ $t('settings.dateFormat') }}</label>
          <Select
            v-model="selectedDateFormat"
            :options="dateFormatOptions"
            class="settings-select"
          />
        </div>
        <div class="settings-option">
          <label class="settings-label">{{ $t('settings.currency') }}</label>
          <Select
            v-model="selectedCurrency"
            :options="currencyOptions"
            class="settings-select"
          />
        </div>
      </div>
      
      <div class="settings-section">
        <h2>{{ $t('settings.account') }}</h2>
        <div class="settings-option">
          <label class="settings-label">{{ $t('settings.email') }}</label>
          <div class="settings-value">user@example.com</div>
        </div>
        <div class="settings-option">
          <label class="settings-label">{{ $t('settings.lastLogin') }}</label>
          <div class="settings-value">2025-04-26 10:30:15</div>
        </div>
        <div class="settings-option">
          <button class="btn-primary">
            {{ $t('settings.changePassword') }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="settings-actions">
      <button class="btn-secondary">
        {{ $t('settings.resetToDefaults') }}
      </button>
      <button class="btn-primary">
        {{ $t('settings.saveChanges') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from '@/components/ui/Select.vue'
import LocaleSelector from '@/components/layout/LocaleSelector.vue'

const { t } = useI18n()

// Theme settings
const selectedTheme = ref('light')
const themeOptions = [
  { value: 'light', label: t('settings.lightTheme') },
  { value: 'dark', label: t('settings.darkTheme') },
  { value: 'system', label: t('settings.systemTheme') }
]

// Notification settings
const emailNotifications = ref(true)
const browserNotifications = ref(true)

// Date format settings
const selectedDateFormat = ref('dd/mm/yyyy')
const dateFormatOptions = [
  { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
  { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
]

// Currency settings
const selectedCurrency = ref('usd')
const currencyOptions = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'rub', label: 'RUB (₽)' },
  { value: 'cny', label: 'CNY (¥)' }
]
</script>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.settings-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.settings-section {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-section h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1F2937;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #E5E7EB;
}

.settings-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4B5563;
}

.settings-select {
  width: 100%;
}

.settings-value {
  padding: 0.5rem 0;
  color: #1F2937;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E5E7EB;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3B82F6;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  padding: 0.625rem 1rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563EB;
}

.btn-secondary {
  padding: 0.625rem 1rem;
  background-color: #F3F4F6;
  color: #1F2937;
  border: 1px solid #E5E7EB;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #E5E7EB;
}

@media (max-width: 767px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
  
  .settings-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
