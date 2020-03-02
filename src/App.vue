<template>
  <div id="app" class="dark-mode">
    <globalHeader ref="header"/>
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view v-on:displayModal="displayModal"/>
    <globalFooter ref="header"/>
    <modal ref="modal"/>
  </div>
</template>

<script>

import globalHeader from './components/globals/header.vue'
import globalFooter from './components/globals/footer.vue'
import modal from './components/partials/modal.vue'

export default {
  name: 'App',
  components: {
    globalHeader,
    globalFooter,
    modal
  },
  props: {},
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    displayModal(info) {
      this.$refs.modal.display(info);
    }
  }
}

</script>
