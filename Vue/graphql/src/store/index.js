import { createStore } from 'vuex'
import auth from './modules/auth';
import createPersistedState from 'vuex-persistedstate';
// const plugins: [createPersistedState()];

export default createStore({
  modules: {
    auth,
    createPersistedState
    // Add other modules here if you have more
  },
})