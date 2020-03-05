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
      <a class="project__slot project__slot--new" @click.prevent="createProject">
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
  data: () => ({
    editingProject: {}
  }),
  mounted() {
    var self = this;

    self.$store.dispatch("projects/getProjects", {
      onSuccess: function(response) {
        self.$store.commit('projects/setProjects', response);
      },
      onError: function(err) {
        console.log(err);
      }
    });
  },
  computed: {
    ...mapGetters("projects", [
        "projects"
    ]),
  },
  watch: {},
  methods: {
    createProject() {
      var self = this;
      var projectCount = self.projects.length + 1;

      var project = {
        ID: projectCount,
        name: "Example Project " + projectCount
      };
      
      self.$store.commit("projects/addProject", project);
    },
    editProject(project) {
      var self = this;
      self.editingProject = project;

      self.$nextTick(function() {
        if (self.$refs.editingProject && 
            self.$refs.editingProject.length > 0) {
            self.$refs.editingProject[0].focus();
        }
      });
    },
  }
}

</script>
