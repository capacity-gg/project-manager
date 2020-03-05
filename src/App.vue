<template>
  <div id="app" class="dark-mode" @click.prevent="hideNavigation">
    <globalHeader ref="header"/>
    <router-view v-on:displayModal="displayModal"/>
    <globalFooter ref="header"/>
    <globalNav ref="nav"/>
    <modal ref="modal"/>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

import globalHeader from './components/globals/header.vue'
import globalFooter from './components/globals/footer.vue'
import globalNav from './components/globals/navigation.vue'
import modal from './components/partials/modal.vue'

export default {
  name: 'App',
  components: {
    globalHeader,
    globalFooter,
    globalNav,
    modal
  },
  props: {},
  data: () => ({}),
  computed: {
    ...mapGetters("navigation", [
        "isNavigationVisible"
    ]),
  },
  watch: {},
  methods: {
    displayModal(info) {
      this.$refs.modal.display(info);
    },
    hideNavigation() {
      this.$store.commit("navigation/setNavigationVisibility", false);
    }
  }
}

</script>
