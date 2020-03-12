<template>
  <div class="content">
    <div class="content__container pad-vert-4">
      <div class="toolbar toolbar--alt">
        <h2 class="toolbar__title">Milestones</h2>
        <div class="toolbar__buttons">
          <csvImport v-model="parseCSV" ref="csvImport"/>
          <div class="button button__primary button__icon tooltip" @click.prevent="exportTableToCSV">
            <span class="icon">
              <font-awesome-icon icon="file-download"/>
            </span>
            <span class="tooltip__text">Export</span>
          </div>
        </div>
      </div>
      <a
        v-for="milestone in milestones" 
        :key="milestone.ID"
        class="slot"
      >
        <input 
          v-if="isEditing(milestone.ID)" 
          v-model="editingMilestone.title"
          v-on:keyup="updateMilestone" 
          :val="editingMilestone.title"  
          class="slot__title slot__title--full"
          ref="editingMilestone"            
          type="text" 
          placeholder="Example name"
        >
        <div v-else>
          <div class="button button__primary button__icon slot__button slot__button--left tooltip" @click.prevent="editMilestone(milestone)">
            <span class="icon">
              <font-awesome-icon icon="edit"/>
            </span>
            <span class="tooltip__text">Edit</span>
          </div>
          <span class="slot__title">{{milestone.title}}</span>
          <div class="button button__primary button__icon slot__button slot__button--right tooltip" @click.prevent="removeMilestone(milestone)">
            <span class="icon">
              <font-awesome-icon icon="trash"/>
            </span>
            <span class="tooltip__text">Delete</span>
          </div>
        </div>
      </a>
      <a class="slot slot__new" @click.prevent="createMilestone">
        <span class="icon">
          <font-awesome-icon icon="plus-square"/>
        </span>
      </a>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

import utils from '@/utils/utils.js';
import csvImport from './partials/csvImport.vue'

export default {
  components: {
    csvImport
  },
  props: {},
  data: () => ({
    editingMilestone: {},
    importedCSV: []
  }),
  mounted() {
    var self = this;

    self.$store.dispatch("milestones/getMilestones", {
      onSuccess: function(response) {
        self.$store.commit('milestones/setMilestones', response);
      },
      onError: function(err) {
        console.log(err);
      }
    });
  },
  computed: {
    ...mapGetters("milestones", [
        "milestones"
    ]),
    parseCSV: {
      get: function() {
        return this.importedCSV;
      },
      set: function(value) {
        var self = this;

        self.importedCSV = value;

        self.importedCSV.forEach(function(row) {
          console.log(row);
        });

        /*self.$store.dispatch("milestones/setMilestones", {
          milestones: self.importedCSV
        });*/
      } 
    }
  },
  watch: {},
  methods: {
    exportTableToCSV() {
      utils.exportTableToCSV(this.milestones, "Milestones");
    },
    createMilestone() {
      var self = this;

      //self.editMilestone(milestone);
      
      self.$store.dispatch("milestones/addMilestone", {
        milestone: {
          title: "New Milestone"
        }
      });
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
    updateMilestone(e) {
      if (e.keyCode !== 13) { return; }

      var self = this;
      
      self.$store.dispatch("milestones/updateMilestone", {
        milestone: self.editingMilestone
      });

      self.editMilestone({});
    },
    removeMilestone(milestone) {
      var self = this;

      self.editMilestone({});
      
      self.$store.dispatch("milestones/removeMilestone", {
        milestone: milestone
      });
    },
    isEditing(ID) {
      return this.editingMilestone && this.editingMilestone.ID == ID;
    }
  }
}

</script>
