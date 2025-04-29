<template>
  <div class="date-picker">
    <label v-if="label" :for="id" class="date-label">{{ label }}</label>
    <div class="date-input-container">
      <input
        :id="id"
        type="date"
        :value="modelValue"
        @input="updateValue"
        class="date-input"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :disabled="disabled"
      />
      <Calendar class="date-icon" />
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: function() {
        const { t } = useI18n()
        return t('components.datePicker.selectDate')
      }
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: function() {
        return `date-${Math.random().toString(36).substr(2, 9)}`
      }
    }
  }
}
</script>

<script setup>
import { Calendar } from 'lucide-vue-next'

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.date-picker {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.date-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}

.date-input-container {
  position: relative;
}

.date-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.date-input:disabled {
  background-color: #F3F4F6;
  cursor: not-allowed;
}

.date-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6B7280;
  pointer-events: none;
}

/* Hide default calendar icon in some browsers */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
