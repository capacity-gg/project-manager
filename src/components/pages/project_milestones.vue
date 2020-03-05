<template>
  <div class="project-selector content__container">
    <div class="project__container">
      <a
        v-for="milestone in milestones" 
        :key="milestone.ID"
        class="project__slot"
      >
        <input 
          v-if="isEditing(milestone.ID)" 
          v-model="editingMilestone.title" 
          :val="editingMilestone.title"  
          class="project__slot--title"
          ref="editingMilestone"            
          type="text" 
          placeholder="Example name"
        >
        <span v-else class="project__slot--title" @click.prevent="editMilestone(milestone)">{{milestone.title}}</span>
      </a>
      <a class="project__slot project__slot--new" @click.prevent="createMilestone">
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
    editingMilestone: {}
  }),
  mounted() {
    var self = this;

    self.$store.dispatch("milestones/getMilestones").then((response) => {});
  },
  computed: {
    ...mapGetters("milestones", [
        "milestones"
    ])
  },
  watch: {},
  methods: {
    createMilestone() {
      var self = this;
      var milestoneCount = self.milestones.length + 1;

      var milestone = {
        ID: milestoneCount,
        title: "New Milestone"
      };

      self.editMilestone(milestone);
      
      self.$store.commit("milestones/addMilestone", milestone);
    },
    editMilestone(milestone) {
      var self = this;
      self.editingMilestone = milestone;

      self.$nextTick(function() {
        if (self.$refs.editingMilestone && 
            self.$refs.editingMilestone.length > 0) {
            self.$refs.editingMilestone[0].focus();
        }
      });
    },
    isEditing(ID) {
      return this.editingMilestone && this.editingMilestone.ID == ID;
    }
  }
}

</script>
