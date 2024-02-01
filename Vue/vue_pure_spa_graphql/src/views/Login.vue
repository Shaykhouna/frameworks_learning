<!-- Login.vue -->
<template>
  <form @submit.prevent="login">
    <input type="text" v-model="username" placeholder="Username">
    <input type="password" v-model="password" placeholder="Password">
    <button type="submit">Login</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const credentials = btoa(`${this.username}:${this.password}`);
      const response = await fetch('https://learn.zone01dakar.sn/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.username, password: this.password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data);
        // Redirect to dashboard or home page
        this.$router.push('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    }
  }
};
</script>
