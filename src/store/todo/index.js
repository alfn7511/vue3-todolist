import actions from './todoActions'
import getters from './todoGetters'
import mutations from './todoMutations'
import state from './todoState'

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
