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
            <div class="modal__buttons flex-content">
                <div class="button button--large button__primary flex__small--6" @click.prevent="save()">Save</div>
                <div class="button button--large button__primary flex__small--6" @click.prevent="revert()">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'modal',
    components: {},
    data: () => ({
        isVisible: false,
        project: {}
    }),
    computed: {},
    watch: {},
    methods: {
        display(info) {
            this.isVisible = true;
            this.project = info;
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
