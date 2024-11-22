import { createRouter, createWebHistory } from 'vue-router'

const requireComponent = require.context('@/views/pages', true, /\.vue$/)
const routes = requireComponent.keys().map((fileName) => {
  const path = fileName
    .replace(/\.\w+$/, '')
    .replace('_', ':')
    .replace('/index', '')
    .replace('.', '')
  const name = path.replace('/', '').replace('/', '-').replace('/', '-')
  console.log(name, path)
  return {
    name,
    path: `${path}`,
    component: requireComponent(fileName).default,
    // props: true,
  }
})

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home.vue'),
    },
    ...routes,
  ],
})

export default router
