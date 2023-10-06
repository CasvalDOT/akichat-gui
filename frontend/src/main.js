import { createApp } from 'vue'
import AkiLogin from './pages/AkiLogin.vue'
import AkiContent from './pages/AkiContent.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import { createPinia } from 'pinia'
import './style.css'
import { IsAuthenticated } from '../wailsjs/go/main/App'

const app = createApp(App)

const routes = [
  { path: '/', component: AkiContent, name: 'root' },
  { path: '/login', component: AkiLogin, name: 'login' },
]

const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const isAuthenticated = await IsAuthenticated()
  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
})

app.use(router)
app.use(pinia)
app.use(VueDOMPurifyHTML, {
  default: {
    ALLOWED_TAGS: ['a', 'strong', 'i', 'q', 'span', 'code'],
  },
})

app.mount('#app')
