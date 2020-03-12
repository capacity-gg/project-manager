<template>
  <div class="content">
    <div class="content__container pad-vert-4">
      <div class="toolbar toolbar--alt">
        <h2 class="toolbar__title">Users</h2>
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
      <div
        v-for="user in users" 
        :key="user.ID"        
        class="slot"
      >
        <input 
          v-if="isEditing(user.ID)" 
          v-model="editingUser.title" 
          v-on:keyup="updateUser"
          :val="editingUser.title"  
          class="slot__title slot__title--full"
          ref="editingUser"            
          type="text" 
          placeholder="Example name"
        >
        <div v-else>
          <div class="button button__primary button__icon slot__button slot__button--left tooltip" @click.prevent="editUser(user)">
            <span class="icon">
              <font-awesome-icon icon="edit"/>
            </span>
            <span class="tooltip__text">Edit</span>
          </div>
          <span class="slot__title">{{user.title}}</span>
          <div class="button button__primary button__icon slot__button slot__button--right tooltip" @click.prevent="removeUser(user)">
            <span class="icon">
              <font-awesome-icon icon="trash"/>
            </span>
            <span class="tooltip__text">Delete</span>
          </div>
        </div>
      </div>
      <a class="slot slot__new" @click.prevent="createUser">
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
    editingUser: {},
    importedCSV: []
  }),
  mounted() {
    var self = this;

    self.$store.dispatch("users/getUsers", {
      onSuccess: function(response) {
        self.$store.commit('users/setUsers', response);
      },
      onError: function(err) {
        console.log(err);
      }
    });
  },
  computed: {
    ...mapGetters("users", [
        "users"
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

        /*self.$store.dispatch("users/setUsers", {
          users: self.importedCSV
        });*/
      } 
    }
  },
  watch: {},
  methods: {
    exportTableToCSV() {
      utils.exportTableToCSV(this.users, "Users");
    },
    createUser() {
      var self = this;

      //self.editUser(user);
      
      self.$store.dispatch("users/addUser", {
        user: {
          title: "New User"
        }
      });
    },
    editUser(user) {
      var self = this;
      self.editingUser = user;

      self.$nextTick(function() {
        if (self.$refs.editingUser && 
            self.$refs.editingUser.length > 0) {
            self.$refs.editingUser[0].focus();
        }
      });
    },
    updateUser(e) {
      if (e.keyCode !== 13) { return; }

      var self = this;
      
      self.$store.dispatch("users/updateUser", {
        user: self.editingUser
      });

      self.editUser({});
    },
    removeUser(user) {
      var self = this;

      self.editUser({});
      
      self.$store.dispatch("users/removeUser", {
        user: user
      });
    },
    isEditing(ID) {
      return this.editingUser && this.editingUser.ID == ID;
    }
  }
}

</script>
