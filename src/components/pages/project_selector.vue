<template>
  <div class="project-selector">
    <div class="project__container">
      <router-link
        v-for="project in projects" 
        :key="project.id"
        to="/project"
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

export default {
  components: {},
  props: {},
  data: () => ({
    projects: [
      {
        id: 1,
        name: "Example Project 1"
      },
      {
        id: 2,
        name: "Example Project 2"
      },
      {
        id: 3,
        name: "Example Project 3"
      }
    ]
  }),
  computed: {},
  watch: {},
  methods: {
    createNewProject() {
      var self = this;
      var projectCount = self.projects.length + 1;

      var project = {
        id: projectCount,
        name: "Example Project " + projectCount
      };

      self.projects.push(project);
    }
  }
}

</script>
