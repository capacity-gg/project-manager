<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>

/**
 * General
 */

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0;
  margin: 0;
}

span {
  font-size: 12px;
}

h1 {
  font-size: 28px !important;
}
h2 {
  font-size: 24px !important;
}
h3 {
  font-size: 22px !important;
}
h4 {
  font-size: 18px !important;
}
h5 {
  font-size: 16px !important;
}
h6 {
  font-size: 12px !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  min-width: 100vw;
}

</style>
