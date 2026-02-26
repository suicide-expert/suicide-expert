// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@primevue/nuxt-module'],
  runtimeConfig: {
    public: {
      supabase: {
        url: 'https://lqwbidrkkwleywhfaqpq.supabase.co',
        key: 'sb_publishable_JqNU8eMLJDQ9CD1Nzs-x4A_1pKDfLIt'
      }
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/c/**', '/a/**', '/p/**', '/login']
    }
  },
  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.dark' }
      }
    }
  },
  css: [
    'primeicons/primeicons.css'
  ]
})
