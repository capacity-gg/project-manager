<template>
  <div id="app" class="dark-mode">
    <globalHeader ref="header"/>
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
