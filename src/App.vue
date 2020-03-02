<template>
  <div id="app" class="dark-mode">
    <globalHeader ref="header"/>
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
    <globalFooter ref="header"/>
  </div>
</template>

<script>

import globalHeader from './components/globals/header.vue'
import globalFooter from './components/globals/footer.vue'

export default {
  name: 'App',
  components: {
    globalHeader,
    globalFooter
  },
  props: {},
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {}
}

</script>
