import { createApp } from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from '@/plugins/router'
import store from '@/plugins/store'
import 'devextreme/dist/css/dx.light.css'
import '@/assets/styles/index.scss'
import mitt from 'mitt'

const app = createApp(App)

// 컨포넌트 import 선언 안해도 참조되게 처리
const requireComponent = require.context('@/components', true, /\.vue$/)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const path = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  const pathArr = path.split('/')
  const componentName = pathArr[pathArr.length - 1]
  // console.log(componentName)
  app.component(`${componentName}`, componentConfig.default || componentConfig)
})

const emitter = mitt()
app.config.globalProperties.$EventBus = emitter
const notiPlugin = {
  install: (app) => {
    const open = (params, mode) => {
      return new Promise((resolve) => {
        // console.log('notiPlugin emit open', { ...params, mode }, resolve)
        // console.log('emit open mode', mode)
        if (mode === 'loading') {
          emitter.emit('isLoading', params)
        } else {
          emitter.emit('open', { ...params, mode, resolve })
        }
      })
    }
    app.config.globalProperties.$alert = (params) => open(params, 'alert')
    app.config.globalProperties.$confirm = (params) => open(params, 'confirm')
    app.config.globalProperties.$eSigning = (params) => open(params, 'eSigning')
    app.config.globalProperties.$isLoading = (params) => open(params, 'loading')
  },
}

app.use(vuetify)
app.use(router)
app.use(store)
app.use(notiPlugin)
app.mount('#app')
