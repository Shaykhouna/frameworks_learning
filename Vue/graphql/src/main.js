import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

window.addEventListener('beforeunload', () => {
    const stateToPersist = JSON.stringify(store.state);
    localStorage.setItem('appState', stateToPersist);
  });

const storedState = localStorage.getItem('appState');
if (storedState) {
  store.replaceState(JSON.parse(storedState));
}

app.use(store).use(router).mount('#app')
