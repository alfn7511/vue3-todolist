import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import todoStore from '@/store/todo'
export default createStore({
  strict: true,
  modules: {
    todo: todoStore,
  },
  plugins: [createPersistedState()],
})
