<template>
  <div class="content">
    <div class="content__container pad-vert-4">
      <h2>Projects</h2>
      <div
        v-for="project in projects" 
        :key="project.ID"        
        class="slot"
      >
        <input 
          v-if="isEditing(project.ID)" 
          v-model="editingProject.name" 
          v-on:keyup="updateProject"
          :val="editingProject.name"  
          class="slot__title slot__title--full"
          ref="editingProject"            
          type="text" 
          placeholder="Example name"
        >
        <div v-else>
          <div class="button button__primary button__icon slot__button slot__button--left tooltip" @click.prevent="editProject(project)">
            <span class="icon">
              <font-awesome-icon icon="edit"/>
            </span>
            <span class="tooltip__text">Edit</span>
          </div>
          <router-link :to="{name: 'project', params: {ID: project.ID}}">
            <span class="slot__title slot__title--full">{{project.name}}</span>
          </router-link>
          <div class="button button__primary button__icon slot__button slot__button--right tooltip" @click.prevent="removeProject(project)">
            <span class="icon">
              <font-awesome-icon icon="trash"/>
            </span>
            <span class="tooltip__text">Delete</span>
          </div>
        </div>
      </div>
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
          name: "New Project"
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
    updateProject(e) {
      if (e.keyCode !== 13) { return; }

      var self = this;
      
      self.$store.dispatch("projects/updateProject", {
        project: self.editingProject
      });

      self.editProject({});
    },
    removeProject(project) {
      var self = this;

      self.editProject({});
      
      self.$store.dispatch("projects/removeProject", {
        project: project
      });
    },
    isEditing(ID) {
      return this.editingProject && this.editingProject.ID == ID;
    }
  }
}

</script>
