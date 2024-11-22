<template>
  <div class="page">
    <v-card outlined elevation="1" class="search-box">
      <div class="search-form">
        <div class="form-wrap"></div>
      </div>
      <div class="search-btns">
        <v-btn @click="doSearch">조회</v-btn>
        <v-btn @click="doSave">저장</v-btn>
      </div>
    </v-card>
    <v-card outlined elevation="1" class="flex-1-1-100 pa-3 mt-1" style="min-height: 0">
      <CompDataTable
        ref="gridRef"
        :config="config"
        :columns="columns"
        :data-source="dataSource"
        @focusedRowChanged="onFocusedRowChanged"
        @editorPreparing="onEditorPreparing"
        @newItem="addRow"
        @delItem="delRow"
      />
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'home',
  data() {
    return {
      columns: [
        {
          caption: '제목',
          dataField: 'title',
          alignment: 'center',
          cssClass: 'col-required',
        },
        {
          caption: '내용',
          dataField: 'body',
          alignment: 'center',
          cssClass: 'col-required',
        },
        {
          caption: '상태',
          dataField: 'isDone',
          alignment: 'center',
        },
      ],
      config: {
        keyExpr: 'id',
        selection: {
          visible: true,
          mode: 'multiple',
        },
        editing: {
          visible: true,
          allowUpdating: true,
          allowAdding: true,
          selectTextOnEditStart: true,
          startEditAction: 'dblClick',
          mode: 'batch',
        },
        toolbar: {
          visible: true,
          searchPanel: true,
          exportButton: true,
          addTemplate: true,
          delTemplate: true,
        },
      },
      dataSource: [],
      gridSelected: {},
      newRowCnt: 0,
    }
  },
  computed: {
    ...mapState('todo', ['todoList']),
    dataGrid() {
      return this.$refs.gridRef.dataGrid()
    },
  },
  mounted() {
    this.doSearch()
  },
  methods: {
    async doSearch() {
      this.dataSource = []
      await this.dataGridInit()
      this.$nextTick(() => {
        this.dataSource = _.cloneDeep(this.todoList)
      })
    },
    onFocusedRowChanged(e) {
      // console.log('onFocusedRowChanged1', e)
    },
    onEditorPreparing(e) {
      if (e.parentType !== 'dataRow' || !e.dataField) return
      // console.log('onEditorPreparing', e)
      console.log(e.caption, e.dataField)
      const { id } = e.row.data
      const rowIndex = this.dataSource.findIndex((item) => item.id === id)
      const editRow = this.dataSource[rowIndex]
      console.log('editRows', editRow)
      const defaultValueChangeHandler = e.editorOptions.onValueChanged
      e.editorOptions.onValueChanged = (args) => {
        console.log(`${e.dataField} onValueChanged`, args)
        if (!_.isEmpty(editRow)) {
          if (!editRow.hasOwnProperty('cmd')) editRow.cmd = 'U'
          editRow[e.dataField] = args.value
        }
        defaultValueChangeHandler(args)
      }
    },
    addRow() {
      console.log('addRow')
      const addId = `temp_${this.newRowCnt++}`
      const addItem = {
        id: addId,
        title: '',
        body: '',
        isDone: false,
        cmd: 'C',
      }
      console.log(addItem)
      this.dataSource = [...this.dataSource, addItem]
    },
    async delRow() {
      const selectedRows = await this.dataGrid.getSelectedRowsData()
      console.log('delRow', selectedRows)
      if (selectedRows.length === 0) return false
      const rs = await this.$confirm({
        type: 'info',
        title: '삭제',
        text: '삭제하시겠습니까?',
      })
      if (rs) {
        const delIds = selectedRows.map((item) => item.id)
        await this.$store.commit('todo/delTodoRows', delIds)
        this.dataSource = []
        await this.doSearch()
      }
    },
    async doSave() {
      const saveRows = this.dataSource.filter((item) => ['C', 'U'].includes(item.cmd))
      console.log('doSave', saveRows)
      if (saveRows.length === 0) return false
      const rs = await this.$confirm({
        type: 'info',
        title: '저장',
        text: '저장하시겠습니까?',
      })
      if (rs) {
        const vaildChk = this.gridValidation(this.columns, saveRows)
        console.log('vaildChk', vaildChk)
        const addRows = saveRows.map((item) => {
          delete item.cmd
          return item
        })
        await this.$store.commit('todo/addTodoRows', addRows)
        this.dataSource = []
        await this.doSearch()
      }
    },
    dataGridInit() {
      this.gridSelected = {}
      this.dataGrid.option('focusedRowIndex', -1)
      this.dataGrid.clearSelection()
      this.dataGrid.clearFilter()
      this.dataGrid.clearSorting()
      this.dataGrid.cancelEditData()
      this.dataGrid.refresh()
    },
    gridValidation(header, rowsData) {
      console.log('recordVaildation rowsData', rowsData)
      if (rowsData.length > 0) {
        const validData = rowsData.some((item) => {
          const rowValid = header.some((col) => {
            const value = item[col.dataField]
            if (col.cssClass === 'col-required') console.log(col.dataField, value)
            if (col.cssClass === 'col-required' && this.isEmptyCol(value)) {
              this.alertWarning(`[${col.caption}] 필수 값을 입력해주세요.`)
              return true
            }
            if (col.validationRules) {
              const validRulesChk = col.validationRules.some((validItem) => {
                console.log(validItem)
                if (
                  validItem.type === 'required' &&
                  col.cssClass !== 'col-required' &&
                  this.isEmptyCol(value)
                ) {
                  this.alertWarning(`[${col.caption}] 필수 값을 입력해주세요.`)
                  return true
                }
                if (!this.isEmptyCol(value)) {
                  if (validItem.type === 'pattern') {
                    if (!validItem.pattern.test(value)) {
                      this.alertWarning(`[${col.caption}] ${validItem.message}`)
                      return true
                    }
                  } else if (validItem.type === 'stringLength') {
                    if (value.length > Number(validItem.max)) {
                      this.alertWarning(`[${col.caption}] ${validItem.message}`)
                      return true
                    }
                  } else if (validItem.type === 'custom') {
                    if (!validItem.validationCallback({ value })) {
                      this.alertWarning(`[${col.caption}] ${validItem.message}`)
                      return true
                    }
                  }
                }

                return false
              })
              return validRulesChk
            }
            if (typeof col.validate === 'function') {
              console.log(col.validate)
              const vaildMsg = this.getValidMsg(col, item)
              if (vaildMsg) {
                this.alertWarning(vaildMsg)
                return true
              }
            }
            return false
          })
          return rowValid
        })
        return validData
      }
      return false
    },
    isEmptyCol(value) {
      return value === '' || value === undefined || value === null || value === 'null'
    },
    alertWarning(text) {
      this.$alert({
        type: 'warning',
        title: '경고',
        text,
      })
    },
    getValidMsg(e, row) {
      const item = _.cloneDeep(row)
      if (this.workTableResultList.length > 0)
        item.workTableResultList = _.cloneDeep(this.workTableResultList)
      item.recordList = _.cloneDeep(this.recordList)
      let msg = ''
      try {
        msg = e.validate(item)
      } catch (error) {
        msg = `[verification][${e.caption}]\n${error}`
      }
      return msg
    },
  },
}
</script>

<style lang="scss" scoped></style>
