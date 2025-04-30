import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

// Import messages
import en from './locales/en.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'

// Import base styles
import './styles/main.css'

// Create i18n instance
export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    zh
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
