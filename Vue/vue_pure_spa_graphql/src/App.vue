<template>
  <header class="header">
  <div class="app-name">Intra01 Clone</div>
    <!-- <div v-if="authStatus" id="nav">
      <div>{{user.name}}</div>
      <button class="auth-button" @click="logOut" > Log Out</button>
    </div> -->
</header>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
