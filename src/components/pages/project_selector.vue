<template>
  <div class="project-selector content__container">
    <div class="project__container">
      <router-link
        v-for="project in projects" 
        :key="project.id"
        :to="{name: 'project', params: {ID: project.ID}}"
        class="project__slot"
      >
        <span class="project__slot--title">{{project.name}}</span>
      </router-link>
      <a class="project__slot project__slot--new" @click.prevent="createNewProject">
        <span class="icon">
          <font-awesome-icon icon="plus-square"/>
        </span>
      </a>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  components: {},
  props: {},
  data: () => ({}),
  mounted() {
    var self = this;

    self.$store.dispatch("projects/getProjects").then((response) => {});
  },
  computed: {
    ...mapGetters("projects", [
        "projects"
    ]),
  },
  watch: {},
  methods: {
    createNewProject() {
      var self = this;
      var projectCount = self.projects.length + 1;

      var project = {
        ID: projectCount,
        name: "Example Project " + projectCount
      };

      self.projects.push(project);
    }
  }
}

</script>
