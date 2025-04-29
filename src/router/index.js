import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/brands',
      meta: {
        allowBack: false
      }
    },
    {
      path: '/brands',
      name: 'salesByBrands',
      component: () => import('../views/SalesByBrandsView.vue'),
      meta: {
        titleKey: 'salesByBrands.title',
        allowBack: false
      }
    },
    {
      path: '/brands-models',
      name: 'salesByBrandsAndModels',
      component: () => import('../views/SalesByBrandsAndModelsView.vue'),
      meta: {
        titleKey: 'salesByBrandsAndModels.title'
      }
    },
    {
      path: '/years',
      name: 'salesByYears',
      component: () => import('../views/SalesByYearsView.vue'),
      meta: {
        titleKey: 'salesByYears.title'
      }
    },
    {
      path: '/market-analysis',
      name: 'marketAnalysis',
      component: () => import('../views/MarketAnalysisView.vue'),
      meta: {
        titleKey: 'marketAnalysis.title',
        allowBack: false
      }
    },
    {
      path: '/model-details',
      name: 'modelDetails',
      component: () => import('../views/ModelDetailsView.vue'),
      meta: {
        titleKey: 'modelDetails.title'
      }
    },
    {
      path: '/orders',
      name: 'orderDetails',
      component: () => import('../views/OrderDetailsView.vue'),
      meta: {
        titleKey: 'orderDetails.title'
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue'),
      meta: {
        titleKey: 'contacts.title'
      }
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/FeedbackStatusView.vue'),
      meta: {
        titleKey: 'feedback.title'
      }
    },
    // Temporarily comment out settings route until we fix the component
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        titleKey: 'navigation.settings',
        allowBack: false
      }
    }
  ]
})

import { i18n } from '../main.js'

// Update page title with localization
router.beforeEach((to, from, next) => {
  const { t } = i18n.global
  const appName = t('appName') || 'Авто-локализации'
  
  let pageTitle = appName
  if (to.meta.titleKey) {
    pageTitle = `${t(to.meta.titleKey)} | ${appName}`
  }
  
  document.title = pageTitle
  next()
})

export default router
