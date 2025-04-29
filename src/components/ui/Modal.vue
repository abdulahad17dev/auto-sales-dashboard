<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="modal-backdrop" @click="closeOnBackdrop ? close() : null">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button @click="close" class="modal-close-btn" aria-label="Close">
              <X class="modal-close-icon" />
            </button>
          </div>
          
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
          <div v-else-if="showDefaultFooter" class="modal-footer">
            <button @click="close" class="btn-cancel">{{ cancelText }}</button>
            <button @click="confirm" class="btn-confirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showDefaultFooter: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  confirmText: {
    type: String,
    default: 'Подтвердить'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  close()
}

// Prevent scrolling on body when modal is open
watch(() => props.modelValue, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-title {
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  color: #1F2937;
}

.modal-close-btn {
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

.modal-close-btn:hover {
  background-color: #E5E7EB;
}

.modal-close-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6B7280;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #F3F4F6;
  color: #4B5563;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #E5E7EB;
}

.btn-confirm {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #3B82F6;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-confirm:hover {
  background-color: #2563EB;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-container {
  animation: modal-in 0.3s ease-out forwards;
}

.fade-leave-active .modal-container {
  animation: modal-out 0.2s ease-in forwards;
}

@keyframes modal-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modal-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-container {
    max-width: 90%;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 1rem;
  }
}
</style>
