import {
  DxDataGrid,
  DxExport,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLoadPanel,
  DxEditing,
  DxToolbar,
  DxItem,
  DxScrolling,
  DxPager,
  DxPaging,
  DxRowDragging,
  DxSorting,
  DxGroupPanel,
  DxGrouping,
} from 'devextreme-vue/data-grid'
import { DxButton } from 'devextreme-vue/button'
import { Workbook } from 'exceljs'
import { exportDataGrid } from 'devextreme/excel_exporter'
import saveAs from 'file-saver'

export default {
  components: {
    DxDataGrid,
    DxExport,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLoadPanel,
    DxEditing,
    DxToolbar,
    DxItem,
    DxScrolling,
    DxPager,
    DxPaging,
    DxButton,
    DxRowDragging,
    DxSorting,
    DxGroupPanel,
    DxGrouping,
  },
  data() {
    return {
      curPageSize: 10,
      defaultPageSizes: [10, 20, 100],
    }
  },
  methods: {
    /*
     * @description 그리드 내 수정된 데이터 색상 표시용
     */
    onRowPrepared(e) {
      if (e.rowType !== 'data') {
        return
      }
      // 추가된 row 색상 넣기
      if (e.data.cmd === 'C') {
        e.rowElement.style.background = '#d1fae5'
      }
    },
    /*
     * @description 엑셀다운로드
     */
    exportGrid(e) {
      const workbook = new Workbook()
      const worksheet = workbook.addWorksheet()
      const title = this.$getExcelTitle()
      exportDataGrid({
        worksheet,
        component: e.component,
      }).then(function () {
        workbook.xlsx.writeBuffer().then(function (buffer) {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), title)
        })
      })
      e.cancel = true
    },
  },
}
