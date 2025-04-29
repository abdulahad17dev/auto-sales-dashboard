<template>
  <div class="select-container">
    <label v-if="label" :for="id" class="select-label">{{ label }}</label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        @change="updateValue"
        class="select-input"
        :disabled="disabled"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option 
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <ChevronDown class="select-icon" />
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: `select-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.select-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}

.select-wrapper {
  position: relative;
}

.select-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  padding-right: 2.5rem;
  appearance: none;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.select-input:disabled {
  background-color: #F3F4F6;
  cursor: not-allowed;
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6B7280;
  pointer-events: none;
}

.error-message {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #EF4444;
}
</style>
