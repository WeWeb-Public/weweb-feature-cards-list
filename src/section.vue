<!-- This is a Vue.js single file component. -->
<!-- Check the Vue.js doc here :  -->
<!-- https://vuejs.org/v2/guide/ -->

<!-- This is your HTML -->
<template>
  <div class="ww-features-cards-list">
    <div class="section-container">
      <!-- wwManager:start -->
      <wwSectionEditMenu :sectionCtrl="sectionCtrl"></wwSectionEditMenu>
      <!-- wwManager:end -->
      <!-- This is the background of the section -->
      <wwObject class="background"
                :ww-object="section.data.background"
                ww-category="background"></wwObject>

      <wwContentList :list="section.data.features"
                     :edit-mode="editMode"
                     :new-item="getNewFeature"
                     :item-to-select="selectedItem"
                     :on-list-changed="onFeatureListChanged"
                     :list-class="'features-list'"
                     :item-wrapper-class="'features-item-wrapper'"
                     ref="featuresList">
        <template #row="{item,index,isItemSelected,toggleItem}">
          <div class="feature-item"
               :class="{selected:isItemSelected(item)}"
               @click="onItemClicked(toggleItem,item, index)">
            <div class="feature-item-content">
              <wwLayoutColumn tag="div"
                              ww-default="ww-text"
                              class="feature-item-top"
                              :ww-list="item.contentList"
                              @ww-add="add(item.contentList, $event)"
                              @ww-remove="remove(item.contentList, $event)">
                <wwObject tag="div"
                          ww-default="ww-text"
                          v-for="content in item.contentList"
                          :class="{selected:isItemSelected(item)}"
                          :key="content.uniqueId"
                          :ww-object="content">
                </wwObject>
                <wwObject tag="div"
                          ww-default="ww-text"
                          class="feature-item-summary"
                          :class="{selected:isItemSelected(item)}"
                          :ww-object="item.summary"
                ></wwObject>
              </wwLayoutColumn>
            </div>
            <wwObject tag="div"
                      class="feature-item-media"
                      :class="{selected:isItemSelected(item)}"
                      :ww-object="item.media"
            ></wwObject>
          </div>
        </template>
      </wwContentList>
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
      selectedItem: {},
      layoutManager: {},
    }),
    computed: {
      section () {
        return this.sectionCtrl.get()
      },
      editMode () {
        return this.sectionCtrl.getEditMode() === 'CONTENT'
      },
      getScreenSize () {
        return this.$store.getters['front/getScreenSize']
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.layoutManager = LayoutManager(this.$refs.featuresList.$el)
      this.layoutManager.configure(this.getScreenSize)
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
        if (this.layoutManager.needUpdate(this.getScreenSize)) {
          this.layoutManager.configure(this.getScreenSize)
          this.layoutManager.update()
        }
      },
      getNewFeature: () => ({
        uniqueId: wwu.getUniqueId(),
        contentList: [],
        media: wwo.getDefault({
          type: 'ww-color'
        }),
        summary: wwo.getDefault({
          type: 'ww-text'
        })
      }),
      onFeatureListChanged () {
        this.update()
        this.$nextTick(() => {
          this.layoutManager.update()
        })
      },
      onItemClicked (toggleItem, item, index) {
        if (this.selectedItem === item) {
          toggleItem(item)
        } else if (!this.selectedItem.isSelected) {
          this.selectedItem = item
        }
        this.$forceUpdate()
        this.layoutManager.toggleItemAt(index)
      },
      update () {
        this.sectionCtrl.update(this.section)
      },
      // --------- EDITOR FUNCTIONS ---------
      // All the codes between /* wwManager:start */ and /* wwManager:end */ are only for editor purposes
      // So It won't in the published website!
      /* wwManager:start */
      add (list, options) {
        list.splice(options.index, 0, options.wwObject)
        this.sectionCtrl.update(this.section)
      },
      remove (list, options) {
        list.splice(options.index, 1)
        this.sectionCtrl.update(this.section)
      }
      /* wwManager:end */
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
    margin: 0 auto;
    padding: 0;
    list-style-type: none;

    @media (min-width: 1440px) {
      width: 1184px;
    }
  }

  .features-list::v-deep .features-item-wrapper {
    position: absolute;
    width: 100%;
    transform-origin: left top;
    will-change: transform;
    transition: all 500ms;
  }

  .feature-item {
    --color-grey-light: #F6F6F6;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 180px;
    padding: 24px 48px;
    border-radius: 24px;
    background-color: var(--color-grey-light);
    transform-origin: left top;
    transition: all 500ms;
    overflow: hidden;
    cursor: pointer;
    pointer-events: all;
    z-index: 1;

    @media (min-width: 992px) {
      flex-direction: row;
      height: 213px;
      width: 530px;
      padding: 48px;
    }

    @media (min-width: 1200px) {
      width: calc(50% - 24px);
    }

    &.selected {
      width: 100%;
      height: 575px;

      @media (min-width: 992px) {
        height: 473px;
      }
    }

    &-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      z-index: 10;

      @media (min-width: 992px) {
        flex-direction: row;
      }
    }

    &-top {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    &-summary {
      visibility: hidden;

      &.selected {
        visibility: visible;
        max-height: 200px;
        overflow: hidden;

        @media (min-width: 992px) {
          max-height: 100px;
          max-width: 472px;;
        }
      }
    }

    &-media {
      visibility: hidden;
      width: 0;
      height: 0;
      margin: auto;
      background-color: #FFF;
      border-radius: 24px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 2000ms 250ms;

      &.selected {
        visibility: visible;
        width: 190px;
        height: 138px;
        opacity: 1;

        @media (min-width: 992px) {
          width: 520px;
          height: 377px;
        }
      }
    }
  }
</style>
