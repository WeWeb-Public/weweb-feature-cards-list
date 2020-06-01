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
                       item-class="feature-item"
                       :edit-mode="editMode"
                       :new-item="createFeature()"
                       :on-list-changed="onListChanged">
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

  import wwContentList from './content-list.vue'
  import LayoutManager from './layoutManager'
  import { getViewPortInfos } from './viewPort'

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
      layoutManager: {},
      viewPortIsMobile: false,
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
      const {isMobile} = getViewPortInfos(window)
      this.layoutManager = LayoutManager(this.$el)
      this.layoutManager.configure(isMobile)
      this.layoutManager.update()
      window.addEventListener('resize', this.onResizeWindow)
    },
    destroyed () {
      window.removeEventListener('resize', this.onResizeWindow)
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
      onResizeWindow () {
        const {isMobile} = getViewPortInfos(window)
        if (isMobile !== this.viewPortIsMobile) {
          this.layoutManager.configure(isMobile)
          this.layoutManager.update()
          this.viewPortIsMobile = isMobile
        }
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
    width: 100%;
    min-height: 500px;
    height: auto;
    margin: auto;
    padding: 0 16px 0 16px;
    list-style-type: none;
    transition: all 1000ms;

    @media (min-width: 1440px) {
      width: 1184px;
      padding: 0;
    }
  }

  .feature-item {
    --color-grey-light: #F6F6F6;
    position: absolute;
    width: 100%;
    height: 180px;
    border-radius: 4px;
    background-color: var(--color-grey-light);
    flex-basis: auto;
    transform-origin: left top;
    transition: all 500ms;

    @media (min-width: 1024px) {
      height: 213px;
      width: 568px;
    }

    &.selected {
      width: 100%;
      height: 575px;

      @media (min-width: 1024px) {
        height: 473px;
      }
    }
  }

</style>
