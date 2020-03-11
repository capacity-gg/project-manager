<template>
  <div class="content">
    <div class="content__container pad-vert-4">
      <h2>Projects</h2>
      <router-link
        v-for="project in projects" 
        :key="project.id"
        :to="{name: 'project', params: {ID: project.ID}}"
        class="slot"
      >
        <span class="slot__title slot__title--full">{{project.name}}</span>
      </router-link>
      <a class="slot slot__new" @click.prevent="createProject">
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
      
      self.$store.dispatch("projects/addProject", {
        project: {
          name: "Example Project"
        }
      });
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
