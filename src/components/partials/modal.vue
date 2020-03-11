<template>
    <div v-if="isVisible" class="modal__background" @click.prevent="close()">
        <div class="modal" @click="stopPropagation">
            <div class="button button__icon--minimal modal__button--close" @click.prevent="close()">
                <span class="icon">
                <font-awesome-icon icon="times"/>
                </span>  
            </div>
            <div class="modal__header">Settings</div>
            <div class="modal__row">
                <label class="modal__label">Project Name</label>
                <input type="text" v-model="project.name" :val="project.name" placeholder="Example name">
            </div>
            <div class="modal__row flex-content">
                <label class="modal__label flex__small--6" style="text-align: center">Assigned Users</label>
                <label class="modal__label flex__small--6" style="text-align: center">Available Users</label>
                <div class="flex__small--6">
                    <draggable 
                        v-model="project.users" 
                        @start="drag=true" 
                        @end="drag=false"
                    >
                        <div 
                            v-for="(user, index) in project.users" :key="index"
                            class="button button__primary fc-event"
                            style="display: block;"
                        >{{user.title}}</div>
                    </draggable>
                </div>
                <div class="flex__small--6">
                    <draggable 
                        v-model="availableUsers" 
                        @start="drag=true" 
                        @end="drag=false"
                    >
                        <div 
                            v-for="(user, index) in availableUsers" :key="index"
                            class="button button__primary fc-event"
                            style="display: block;"
                        >{{user.title}}</div>
                    </draggable>
                </div>
            </div>
            <div class="modal__buttons flex-content">
                <div class="button button--large button__primary flex__small--6" @click.prevent="save()">Save</div>
                <div class="button button--large button__primary flex__small--6" @click.prevent="revert()">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>

import draggable from 'vuedraggable'
import utils from '@/utils/utils.js';

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
    name: 'modal',
    components: {
        draggable
    },
    data: () => ({
        isVisible: false,
        project: {},
        availableUsers: []
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
        display(info) {
            var self = this;

            self.isVisible = true;
            self.availableUsers = [];
            self.project = utils.objPlus({
                "users": []
            }, info);

            self.users.forEach(function(user) {
                var isUserAvailable = true;

                self.project.users.forEach(function(projectUser) {
                    if (projectUser.title == user.title) {
                        isUserAvailable = false;
                        return;
                    }
                });

                if (isUserAvailable) {
                    self.availableUsers.push(user);
                }
            });
        },
        close() {
            this.isVisible = false;
        },
        save() {
            this.close();
        },
        revert() {
            this.close();
        },
        stopPropagation(e) {
            e.stopPropagation();
        }
    }
}

</script>
