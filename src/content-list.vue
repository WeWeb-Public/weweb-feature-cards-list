<template>
  <ul :class="listClass">
    <li v-for="(item, index) in items"
        :class="itemWrapperClass"
        :key="item.uniqueId">
      <!-- wwManager:start -->
      <wwContextMenu v-if="editMode"
                     class="ww-orange-button"
                     tag="div"
                     :options="elemOptions"
                     @remove="removeItem(item)"
                     @addBefore="addItemBefore(index)"
                     @addAfter="addItemAfter(index)">
        <wwOrangeButton style="z-index: 10"></wwOrangeButton>
      </wwContextMenu>
      <!-- wwManager:end -->
      <slot name="row"
            :item="item"
            :index="index"
            :toggleItem="toggleItem"
            :isItemSelected="isItemSelected">
      </slot>
    </li>
  </ul>
</template>

<script>
  const wwu = window.wwLib.wwUtils

  export default {
    name: 'wwContentList',
    props: {
      list: {
        type: Array,
        required: true
      },
      editMode: {
        type: Boolean,
        required: true
      },
      newItem: {
        type: Function,
        required: true,
        default: () => {
        }
      },
      listClass: String,
      itemWrapperClass: String,
      itemToSelect: Object,
      onListChanged: {
        type: Function,
        default: () => {
        }
      }
    },
    data: () => ({
      items: [],
      selectedItem: void 0,
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
    created() {
      this.items = this.list.map(item => {
        return {
          ...item,
          isSelected: false
        }
      })
    },
    methods: {
      createItem() {
        if (this.items.length > 0) {
          const item = JSON.parse(JSON.stringify(this.items[0]))
          wwu.changeUniqueIds(item)
          item.uniqueId = wwu.getUniqueId()
          return item
        }
        return this.newItem()
      },
      toggleItem(item) {
        item.isSelected = !item.isSelected
      },
      isItemSelected(item) {
        return item.isSelected
      },
      addItemBefore(index) {
        this.addItemAt(index === 0 ? 0 : index - 1)
      },
      addItemAfter(index) {
        this.addItemAt(index + 1)
      },
      addItemAt(index) {
        const items = [...this.items]
        const head = items.slice(0, index)
        const tail = index === 0 ? items : items.slice(index)
        this.items = [...head, this.createItem(), ...tail]
        this.onListChanged()
      },
      removeItem(item) {
        if (this.items.length === 1) return
        this.items = this.items.filter(aItem => aItem !== item)
        this.onListChanged()
      }
    }
  }
</script>
