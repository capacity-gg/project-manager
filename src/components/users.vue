<template>
  <div class="project-selector content__container">
    <div class="project__container">
      <a
        v-for="user in users" 
        :key="user.ID"        
        class="project__slot"
      >
        <input 
          v-if="isEditing(user.ID)" 
          v-model="editingUser.title" 
          :val="editingUser.title"  
          class="project__slot--title"
          ref="editingUser"            
          type="text" 
          placeholder="Example name"
        >
        <span v-else class="project__slot--title" @click.prevent="editUser(user)">{{user.title}}</span>
      </a>
      <a class="project__slot project__slot--new" @click.prevent="createUser">
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
    editingUser: {}
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
    ])
  },
  watch: {},
  methods: {
    createUser() {
      var self = this;
      var userCount = self.users.length + 1;

      var user = {
        ID: userCount,
        title: "New User"
      };

      self.editUser(user);
      
      self.$store.commit("users/addUser", user);
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
    isEditing(ID) {
      return this.editingUser && this.editingUser.ID == ID;
    }
  }
}

</script>
