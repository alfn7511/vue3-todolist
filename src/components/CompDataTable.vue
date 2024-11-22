<template>
  <DxDataGrid
    ref="dataGrid"
    width="100%"
    height="100%"
    key-expr="id"
    :columns="columns"
    :data-source="dataSource"
    :show-borders="true"
    :show-row-lines="true"
    :show-column-lines="true"
    :word-wrap-enabled="true"
    :row-alternation-enabled="true"
    :hover-state-enabled="true"
    :focused-row-enabled="true"
    :repaint-changes-only="true"
    :allow-column-resizing="true"
    :allow-column-reordering="true"
    :column-auto-width="options.columnAutoWidth"
    @focused-row-changed="onFocusedRowChanged"
    @row-prepared="onRowPrepared"
    @editor-preparing="onEditorPreparing"
  >
    <DxLoadPanel :enabled="true" :shading="true" shading-color="rgba(0,0,0,0.1)" />
    <DxHeaderFilter :visible="options.headerFilterVisible" />
    <DxSearchPanel :visible="options.searchPanelVisible" :width="240" placeholder="Search..." />
    <!-- "single" or "multiple" | "none" -->
    <DxSorting :mode="options.sorting" />
    <DxSelection
      v-if="options.selection.visible"
      :deferred="options.selection.deferred"
      :mode="options.selection.mode"
      :recursive="options.selection.recursive"
      :select-all-mode="options.selection.selectAllMode || 'allPages'"
      :show-check-boxes-mode="options.selection.showCheckBoxesMode || 'onClick'"
      :allow-select-all="options.selection.allowSelectAll"
    />
    <DxEditing
      v-if="options.editing.visible"
      :allow-adding="options.editing.allowAdding"
      :allow-updating="options.editing.allowUpdating"
      :allow-deleting="options.editing.allowDeleting"
      :select-text-on-edit-start="options.editing.selectTextOnEditStart"
      :start-edit-action="options.editing.startEditAction"
      :mode="options.editing.mode"
    />
    <DxToolbar :visible="options.toolbar.visible">
      <DxItem
        v-if="options.toolbar.beforeCustom"
        :visible="options.toolbar.beforeCustom"
        location="before"
        template="beforeCustom"
      />
      <DxItem
        v-if="options.toolbar.searchLabel"
        :visible="options.toolbar.searchLabel"
        location="before"
        template="searchLabel"
      />
      <DxItem
        v-if="options.toolbar.searchPanel"
        :visible="options.toolbar.searchPanel"
        location="before"
        name="searchPanel"
      />
      <DxItem
        v-if="options.toolbar.exportButton"
        :visible="options.toolbar.exportButton"
        location="before"
        name="exportButton"
      />
      <DxItem
        v-if="options.toolbar.afterCustom"
        :visible="options.toolbar.afterCustom"
        location="after"
        template="afterCustom"
      />
      <DxItem
        v-if="options.toolbar.addTemplate"
        :visible="options.toolbar.addTemplate"
        location="after"
        template="addTemplate"
      />
      <DxItem
        v-if="options.toolbar.delTemplate"
        :visible="options.toolbar.delTemplate"
        location="after"
        template="delTemplate"
      />
      <DxItem
        v-if="options.toolbar.groupPanel"
        :visible="options.toolbar.groupPanel"
        location="after"
        name="groupPanel"
      />
    </DxToolbar>
    <template v-if="options.toolbar.beforeCustom" #beforeCustom>
      <slot name="toolbarBefore-custom"></slot>
    </template>
    <template v-if="options.toolbar.afterCustom" #afterCustom>
      <slot name="toolbarAfter-custom"></slot>
    </template>
    <template v-if="options.toolbar.addTemplate" #addTemplate>
      <DxButton icon="plus" @click="newItem" />
    </template>
    <template v-if="options.toolbar.delTemplate" #delTemplate>
      <DxButton icon="minus" @click="delItem" />
    </template>
    <template v-if="options.toolbar.searchLabel" #searchLabel>
      <div v-if="options.toolbar.searchLabelText" class="label">
        {{ options.toolbar.searchLabelText }}
      </div>
    </template>
  </DxDataGrid>
</template>

<script>
import {
  DxDataGrid,
  DxLoadPanel,
  DxHeaderFilter,
  DxSearchPanel,
  DxSorting,
  DxSelection,
  DxEditing,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/data-grid'
import { DxButton } from 'devextreme-vue/button'
export default {
  name: 'CompDataTable',
  components: {
    DxDataGrid,
    DxLoadPanel,
    DxHeaderFilter,
    DxSearchPanel,
    DxSorting,
    DxSelection,
    DxEditing,
    DxToolbar,
    DxItem,
    DxButton,
  },
  emits: ['focusedRowChanged', 'newItem', 'delItem', 'onRowPrepared', 'editorPreparing'],
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      configDefalut: {
        id: 'dataGrid',
        keyExpr: 'tkey',
        width: '100%',
        height: '100%',
        columnAutoWidth: false,
        headerFilterVisible: false,
        searchPanelVisible: true,
        sorting: 'none',
        selection: {
          visible: false,
          deferred: false,
          mode: 'multiple', // single
          recursive: false,
          selectAllMode: 'allPages', // page, allPages
          showCheckBoxesMode: 'always', // 'none', 'onClick', 'onLongTap', 'always'
          allowSelectAll: true,
        },
        editing: {
          visible: false,
          allowAdding: false,
          allowUpdating: false,
          allowDeleting: false,
          selectTextOnEditStart: false,
          startEditAction: 'dblClick',
          mode: 'batch',
        },
        toolbar: {
          visible: false,
          beforeCustom: false,
          searchPanel: false,
          exportButton: false,
          addTemplate: false,
          delTemplate: false,
          searchLabel: false,
          searchLabelText: '',
          groupPanel: false,
          addBtnDisabled: false,
          delBtnDisabled: false,
        },
      },
    }
  },
  computed: {
    options() {
      const config = { ...this.configDefalut, ...this.config }
      console.log('DxDataGrid config', config)
      if (config.selection && config.selection.visible) {
        config.selection.showCheckBoxesMode = 'always'
        if (config.selection.mode === 'multiple') {
          config.selection = {
            ...config.selection,
            visible: true,
            deferred: true,
            mode: 'multiple',
            showCheckBoxesMode: 'always',
            selectAllMode: 'allPages',
          }
        }
      }
      return config
    },
  },
  methods: {
    dataGrid() {
      return this.$refs.dataGrid.instance
    },
    onFocusedRowChanged(e) {
      this.$emit('focusedRowChanged', e)
    },
    onRowPrepared(e) {
      if (e.rowType !== 'data') return
      // console.log('onRowPrepared', e)
      this.$emit('onRowPrepared', e)
      const { cmd } = e.data
      const rowEl = e.rowElement.classList
      /*
       * C : 추가 / U: 수정 / O : 순서변경
       */
      if (['C', 'U', 'O'].includes(cmd)) {
        rowEl.add('rowEditMark')
      } else {
        rowEl.remove('rowEditMark')
      }
    },
    onEditorPreparing(e) {
      this.$emit('editorPreparing', e)
    },
    newItem(e) {
      this.$emit('newItem', e)
    },
    delItem(e) {
      this.$emit('delItem', e)
    },
  },
}
</script>

<style lang="scss" scoped></style>
