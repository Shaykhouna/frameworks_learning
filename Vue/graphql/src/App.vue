
<template>
  <div id="app">
    <router-view v-if="isAuthenticated" /> <!-- Render dashboard if authenticated -->
    <Login v-else /> <!-- Render login component if not authenticated -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Login from './views/Login.vue'; // Import your Login component

export default {
  name: 'App',
  components: {
    Login,
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']), // Map isAuthenticated getter from Vuex
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
