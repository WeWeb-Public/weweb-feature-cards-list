<!-- This is a Vue.js single file component. -->
<!-- Check the Vue.js doc here :  -->
<!-- https://vuejs.org/v2/guide/ -->

<!-- This is your HTML -->
<template>
    <div>
        <div class="section-container">
            <!-- wwManager:start -->
            <wwSectionEditMenu :sectionCtrl="sectionCtrl"></wwSectionEditMenu>
            <!-- wwManager:end -->

            <!-- This is the background of the section -->
            <wwObject class="background"
                      :ww-object="section.data.background"
                      ww-category="background"></wwObject>

            <div class="content"></div>
        </div>
    </div>
</template>

<!-- This is your Javascript -->
<!-- ✨ Here comes the magic ✨ -->
<script>

    const wwo = window.wwLib.wwObject;
    const wwu = window.wwLib.wwUtils;

    export default {
        name: "__COMPONENT_NAME__",
        props: {
            sectionCtrl: Object
        },
        data: () => ({
            elemOptions: {

                items: [
                    {
                        text: {
                            en: 'Before',
                            fr: 'Avant'
                        },
                        icon: 'wwi wwi-add',
                        action: 'addBefore'
                    },
                    {
                        text: {
                            en: 'After',
                            fr: 'Apres'
                        },
                        icon: 'wwi wwi-add',
                        action: 'addAfter'
                    },
                    {
                        text: {
                            en: 'Delete',
                            fr: 'Supprimer'
                        },
                        icon: 'wwi wwi-delete',
                        action: 'remove'
                    }
                ]
            }
        }),
        computed: {
            section() {
                return this.sectionCtrl.get();
            },

            editMode() {
                return this.sectionCtrl.getEditMode() === 'CONTENT'
            },
        },
        created() {
            this.init()
        },

        methods: {
            init() {
                let needUpdate = false
                this.section.data = this.section.data || {};

                if (!this.section.data.features) {
                    this.section.data.features = [this.createFeature()]
                    needUpdate = true
                }
                needUpdate && this.update();
            },

            getNewFeature: () => ({
                uniqueId: wwu.getUniqueId(),
                contentList: [],
                media: wwo.getDefault({
                    type: 'ww-row'
                }),
            }),

            createFeature() {
                let feature = {}
                if (this.section.data.features.length > 0) {
                    feature = JSON.parse(JSON.stringify(this.section.data.features[0]))
                    wwu.changeUniqueIds(feature)
                    feature.uniqueId = wwu.getUniqueId()
                    return feature
                }
                return this.getNewFeature()
            },

            update() {
                this.sectionCtrl.update(this.section);
            },

            /* wwManager:start */
            add(list, options) {
                list.splice(options.index, 0, options.wwObject);
                this.update()
            },
            remove(list, {index}) {
                list.splice(index, 1);
                this.update()
            }
            /* wwManager:end */
        }
    };
</script>

<style lang="scss" scoped>

    .section-container {
        padding:24px;
        margin: auto;
        color: var(--color-true-black);
    }

    .background {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }


</style>
