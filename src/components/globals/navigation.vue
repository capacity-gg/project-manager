<template>    
    <div 
      id="nav" 
      class="nav" 
      :class="isNavigationVisible ? 'nav--visible' : ''" 
      @click.prevent="stopPropagation"
    >
      <ul class="nav__item-list">
        <li class="nav__item" @click.prevent="navigateToLink('project_selector')">Projects</li>
      </ul>
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
      navigateToLink(link) {
        this.$store.commit("navigation/setNavigationVisibility", false);

        // Ignore navigation attempts to current page
        if (this.$router.history.current.name != link) {
            this.$router.push({name: link});
        }
      },
      stopPropagation(e) {
          e.stopPropagation();
      }
    }
};

</script>
