<template>
  <div id="header" class="header">
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
    <div :class="isNavigationVisible ? 'nav--visible' : ''" class="nav">
      <ul class="nav__item-list">
        <li class="nav__item" @click.prevent="navigateToLink('project_selector')">Projects</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
    props: {},
    data: () => ({
      isNavigationVisible: false
    }),
    computed: {},
    watch: {},
    methods: {
      toggleNavigationVisibility() {
        this.isNavigationVisible = !this.isNavigationVisible;
      },
      navigateToLink(link) {
        this.isNavigationVisible = false;

        // Ignore navigation attempts to current page
        if (this.$router.history.current.name != link) {
            this.$router.push({name: link});
        }
      }
    }
};

</script>
