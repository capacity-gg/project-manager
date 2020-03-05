<template>
  <div id="header" class="header">
    <div class="content__container">
      <h1 class="header__title">Project Management Tool</h1>
      <div class="header__buttons">
        <div 
          class="button button__icon button__icon--minimal" 
          @click.prevent="toggleNavigationVisibility"
        >
          <span class="icon">
            <font-awesome-icon v-if="isNavigationVisible" icon="times"/>
            <font-awesome-icon v-else icon="bars"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
    props: {},
    data: () => ({}),
    computed: {
      ...mapGetters("navigation", [
          "isNavigationVisible"
      ]),
    },
    watch: {},
    methods: {
      toggleNavigationVisibility(e) {
        // Prevent App.vue from hiding navigation
        e.stopPropagation();

        this.$store.commit("navigation/toggleNavigationVisibility");
      }
    }
};

</script>
