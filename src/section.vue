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

      <ww-content-list :list="section.data.features"
                       :list-class="'features-list'"
                       :edit-mode="editMode"
                       :new-item="createFeature()"
                       :on-change="onListChanged">
        <template #row="{item,index,selectItem}">
          <div class="feature-item"
               :data-idx="index"
               :class="{selected:item.isSelected}"
               @click="onItemClicked(index)">
            <span>{{index}}</span>
          </div>
        </template>
      </ww-content-list>
    </div>
  </div>
</template>

<!-- This is your Javascript -->
<!-- ✨ Here comes the magic ✨ -->
<script>

  const wwo = window.wwLib.wwObject
  const wwu = window.wwLib.wwUtils

  const options = {
    horizontalGutter: 48,
    verticalGutter: 48,
    elementWidth: 568,
    elementHeight: 213,
    selectedElementHeight: 473,
    itemsRerRow: 2
  }

  import wwContentList from './content-list.vue'
  import LayoutManager from './layoutManager'

  export default {
    name: '__COMPONENT_NAME__',
    props: {
      sectionCtrl: Object
    },
    components: {
      wwContentList
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
      },
      layoutManager: {}
    }),
    computed: {
      section () {
        return this.sectionCtrl.get()
      },

      editMode () {
        return this.sectionCtrl.getEditMode() === 'CONTENT'
      },
    },
    created () {
      this.init()
    },
    mounted () {
      this.layoutManager = LayoutManager(this.$el)
      this.layoutManager.configure(options)
      this.layoutManager.update()
    },

    methods: {
      init () {
        let needUpdate = false
        this.section.data = this.section.data || {}

        if (!this.section.data.background) {
          this.section.data.background = wwo.getDefault({
            type: 'ww-color'
          })
          needUpdate = true
        }

        if (!this.section.data.features) {
          this.section.data.features = [this.getNewFeature()]
          needUpdate = true
        }
        needUpdate && this.update()
      },
      getNewFeature: () => ({
        uniqueId: wwu.getUniqueId(),
        contentList: [],
        media: wwo.getDefault({
          type: 'ww-color'
        }),
      }),

      createFeature () {
        const {features} = this.section.data
        if (Array.isArray((features)) && features.length > 0) {
          const feature = JSON.parse(JSON.stringify(features[0]))
          wwu.changeUniqueIds(feature)
          feature.uniqueId = wwu.getUniqueId()
          return feature
        }
        return this.getNewFeature()
      },
      onListChanged () {
        this.$nextTick(() => {
          this.layoutManager.update()
        })
      },

      onItemClicked (index) {
        this.layoutManager.toggleItemAt(index)
      },
      update () {
        this.sectionCtrl.update(this.section)
      }
    }
  }
</script>

<style lang="scss"
       scoped>

  .section-container {
    padding: 24px;
    margin: auto;
    color: var(--color-true-black);
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  .features-list {
    position: relative;
    width: 1184px;
    min-height: 500px;
    height: auto;
    margin: auto;
    list-style-type: none;
    transition: all 1000ms;
  }

  .feature-item {
    --color-grey-light: #F6F6F6;
    position: absolute;
    width: 568px;
    height: 213px;
    border-radius: 4px;
    margin-bottom: 48px;
    margin-right: 0;
    background-color: var(--color-grey-light);
    flex-basis: auto;
    transform-origin: left top;
    transition: all 500ms;

    @media (min-width: 1024px) {
      width: 568px;
      margin-bottom: 48px;
      margin-right: 48px;
    }

    &.selected {
      width: 100%;
      height: 473px;
      flex-basis: 100%;
    }
  }

</style>
