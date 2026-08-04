import '@/assets/main.css'
import 'primeicons/primeicons.css'
import 'qweather-icons/font/qweather-icons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import { definePreset } from '@primeuix/themes'
import Tooltip from 'primevue/tooltip'
import VChart from 'vue-echarts'


const app = createApp(App)
const PastoralPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}', // 主色偏蓝
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
    },
  },
})


app.component('VChart', VChart)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: PastoralPreset,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
app.use(ToastService);
app.directive('tooltip',Tooltip);
app.mount('#app');
