import ExcelJS from 'exceljs'

// 导入参数数据类型
export interface importExcelType {
  /**
   * 第 i 张工作表
   */
  i?: number
  /**
   * 表格表头字段数组
   */
  header: readonly any[]
}

// 导出参数数据类型
export interface exportExcelType {
  /**
   * 数据
   */
  data: { [key: string]: any }[]
  /**
   * 文件名
   */
  name: string
  /**
   * 表头字段
   */
  header: string[]
  /**
   * 表头字段对应中文
   */
  customHeader: string[]
  /**
   * 工作表名
   */
  sheetName?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 小标题
   */
  subTitle?: string
  /**
   * 工作表保护密码
   */
  password?: string
  /**
   * 对齐方式
   */
  alignment?: Partial<ExcelJS.Alignment>
  /**
   * 合并单元格
   */
  mergeList?: mergeListType[]
  /**
   * 标题样式
   */
  titleStyle?: Partial<ExcelJS.Row>
  /**
   * 小标题样式
   */
  subTitleStyle?: Partial<ExcelJS.Row>
  /**
   *  表头样式
   */
  headerStyle?: Partial<ExcelJS.Row>
  /**
   * 单元格统一样式
   */
  cellStyle?: Partial<ExcelJS.Row & ExcelJS.Column>
}

// 合并单元格数据类型
export interface mergeListType {
  startRow: number
  startColumn: number
  endRow: number
  endColumn: number
}

// exceljs相关方法
export class Excel {
  blob?: Blob // 导入的blob文件
  worksheet?: ExcelJS.Worksheet // 当前工作表
  header: string[] // 表头字段数组
  constructor(blob?: Blob) {
    this.blob = blob
    this.worksheet = undefined
    this.header = []
  }
  /**
   * @description: blob转ArrayBuffer（用于后续生成文件数据）
   * @return {Promise<ArrayBuffer>} ArrayBuffer
   */
  private readFile(): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      if (!this.blob) {
        reject('上传文件异常!')
      } else {
        reader.readAsArrayBuffer(this.blob)
        reader.onload = (ev) => {
          resolve(ev.target!.result as ArrayBuffer)
        }
      }
    })
  }
  /**
   * @description: 导入excel文件获取workbook（workbook属性方法参考exceljs文档）
   * @return {Promise<ExcelJS.Workbook>}
   */
  public async getWorkBook(): Promise<ExcelJS.Workbook> {
    const buffer = await this.readFile()
    const workbook = new ExcelJS.Workbook()
    return await workbook.xlsx.load(buffer)
  }

  /**
   * @description: 获取第i张工作表
   * @param {number} i 工作表序号
   * @return {Promise<ExcelJS.Worksheet>} 返回第 i 个工作表
   */
  public async getWorkSheet(i = 0): Promise<ExcelJS.Worksheet | undefined> {
    const workbook = await this.getWorkBook()
    return workbook.getWorksheet(i)
  }

  /**
   * @description: 将 excel 第i张工作表的数据转为对象数据
   * @param {number} i 工作表序号
   * @param {string[]} header 表头字段数组
   * @return {Promise<Record<(typeof header)[number], string>[]>} 传入表头作为字段的对象数组(每个元素对象对应每一行)
   */
  public async importExcel(
    options: importExcelType
  ): Promise<Record<(typeof header)[number], string>[] | boolean> {
    const { i = 1, header } = options
    const workbook = await this.getWorkBook()
    const worksheet = workbook.getWorksheet(i)
    if (!worksheet) return false
    // excel导入后返回的数组
    const excelList: Record<(typeof header)[number], string>[] = []

    worksheet
      .getSheetValues()
      .filter((temp) => !!temp?.length)
      .forEach((item) => {
        // 移除空行
        // 移除每行首个空元素
        ;(item as string[]).shift()
        // 定义临时对象存储每一行内容
        const tempObj: Record<(typeof header)[number], string> = {}
        ;(item as string[]).forEach((item2, index2) => {
          tempObj[header[index2]] = item2
        })
        excelList.push(tempObj)
      })
    return excelList
  }

  /**
   * @description: 导出excel，参数信息参考exceljs
   * @param {*} data 数据
   * @param {*} name 文件名
   * @param {*} header 表头字段
   * @param {*} customHeader 表头字段对应中文
   * @param {*} sheetName 工作表名
   * @param {*} title 标题
   * @param {*} subTitle 副标题（日期）
   * @param {*} password 冻结表格密码
   * @param {*} mergeList 合并单元格数组
   * @param {*} titleStyle 标题样式(按需补充方法)
   * @param {*} subTitleStyle 小标题样式(按需补充方法)
   * @param {*} headerStyle 表头字段样式(按需补充方法)
   * @param {*} cellStyle 单元格样式(按需补充方法)
   * @return {*}
   */

  public async exportExcel(options: exportExcelType): Promise<void> {
    const {
      data,
      name,
      header,
      customHeader,
      sheetName = 'sheet1',
      title = '',
      subTitle = '',
      password = '',
      mergeList = [],
      titleStyle,
      subTitleStyle,
      headerStyle,
      cellStyle
    } = options
    // 创建工作簿
    const workbook = new ExcelJS.Workbook()
    workbook.creator = '侃侃'
    workbook.created = new Date()
    // 添加sheet
    this.worksheet = workbook.addWorksheet(sheetName, {
      properties: { tabColor: { argb: 'FF00FF00' } }
    })
    this.header = header
    // 表头行序号
    let headerRowId = 1
    if (title) headerRowId++
    if (subTitle) headerRowId++
    // 插入单元格数据
    this.setCells(data, customHeader, cellStyle)
    // 插入大标题
    this.getTitle(title, titleStyle)
    // 插入小标题
    this.getSubTitle(subTitle, subTitleStyle)
    // 处理表头
    this.setHeaderStyle(headerRowId, data, headerStyle)
    // 更多处理
    this.handleDealExcel(password, mergeList, headerRowId)
    // 导出excel(此处也可用file-saver将blob导出到excel文件  fs.saveAs(blob, name+'.xlsx');)
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = name + '.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(a.href)
    })
  }
  /**
   * @description: 合并单元格数组
   * @param {Partial} merge1 需要合并的行/列起止对象数组1
   * 例：[{ startRow: 1, endRow: 1},{ startRow: 10, endRow: 10}]
   * @param {Partial} merge2 需要合并的列/行起止对象数组2
   * 例：[{ startColumn: 1, endColumn: 2 }]
   * @return {*} mergeArr 合并后数组
   * 例：[{ startRow: 1, endRow: 1, startColumn: 1, endColumn: 2},{ startRow: 10, endRow: 10, startColumn: 1, endColumn: 2}]
   */
  public merge(
    merge1: Partial<mergeListType>[],
    merge2: Partial<mergeListType>[]
  ): mergeListType[] {
    const mergeArr: any[] = []
    merge1.forEach((item1) => {
      mergeArr.push(
        ...merge2.map((item2) => {
          return { ...item2, ...item1 }
        })
      )
    })
    return mergeArr
  }

  /**
   * @description:单元格数据处理
   * @param {any} data 表格数据
   * @param {string} customHeader  表头中文字段
   * @return {*}
   */
  private setCells(
    data: exportExcelType['data'],
    customHeader: string[],
    style?: Partial<ExcelJS.Row & ExcelJS.Column>
  ): void {
    // 设置列，插入中文表头
    const column: Partial<ExcelJS.Column>[] = []
    this.header.forEach((item, index) => {
      column.push({
        header: customHeader[index],
        key: item,
        width: style?.width || 25
      })
    })
    this.worksheet!.columns = column
    // 设置行，添加数据
    this.worksheet?.addRows(data)
    // 设置行高
    this.worksheet?.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.height = style?.height || 20
    })
    // 获取每一列数据，再依次对齐
    this.worksheet!.columns.forEach((column) => {
      column.alignment = style?.alignment || {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      }
    })
  }
  /**
   * @description: 添加大标题
   * @param {string} title 标题
   * @param {any} style 标题样式
   * @return {*}
   */
  private getTitle(title: string, style?: Partial<ExcelJS.Row>): void {
    if (title) {
      // 插入标题
      this.worksheet?.spliceRows(1, 0, [title])
      this.worksheet?.mergeCells(1, 1, 1, this.header.length)
      // 调整标题样式
      const titleRow = this.worksheet!.getRow(1)
      // 高度
      titleRow.height = style?.height || 40
      // 字体设置
      titleRow.font = style?.font || {
        size: 20,
        bold: true
      }
      // 背景色
      titleRow.fill = style?.fill || {
        bgColor: {
          argb: 'FFFFFF00'
        },
        type: 'pattern',
        pattern: 'none'
      }
      // 对齐方式
      titleRow.alignment = style?.alignment || {
        horizontal: 'center',
        vertical: 'middle'
      }
    }
  }
  /**
   * @description: 添加小标题
   * @param {string} subTitle 标题
   * @param {Partial} style 小标题样式
   * @return {*}
   */
  private getSubTitle(subTitle: string, style?: Partial<ExcelJS.Row>): void {
    if (subTitle) {
      this.worksheet?.spliceRows(2, 0, [subTitle])
      this.worksheet?.mergeCells(2, 1, 2, this.header.length)
      // 调整标题样式
      const subtitleRow = this.worksheet!.getRow(2)
      // 高度
      subtitleRow.height = style?.height || 20
      // 字体设置
      subtitleRow.font = style?.font || {
        size: 14
      }
      // 背景色
      subtitleRow.fill = style?.fill || {
        bgColor: {
          argb: 'FFFFFF00'
        },
        type: 'pattern',
        pattern: 'none'
      }
      // 对齐方式
      subtitleRow.alignment = style?.alignment || {
        horizontal: 'right',
        vertical: 'middle'
      }
    }
  }
  /**
   * @description: 设置表头样式
   * @param {number} num 表头在第几行
   * @param {number} data 总数据
   * @param {number} style 表头样式
   * @return {*}
   */
  private setHeaderStyle(num: number, data: any, style?: Partial<ExcelJS.Row>): void {
    // 自动筛选器
    this.worksheet!.autoFilter = {
      from: {
        row: num,
        column: 1
      },
      to: {
        row: data.length,
        column: this.header.length
      }
    }
    // 给表头添加背景色
    const headerRow = this.worksheet!.getRow(num)
    headerRow!.height = style?.height || 30
    // 通过 cell 设置背景色，更精准
    headerRow?.eachCell((cell) => {
      cell.fill = style?.fill || {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'dde0e7' }
      }
      cell.font = style?.font || {
        size: 12
      }
    })
  }
  /**
   * @description: 其他内容处理
   * @param {string} password 密码
   * @param {mergeListType} mergeList 合并行列数组
   * @param {number} headerRowId  表头行序号
   * @return {*}
   */
  private handleDealExcel(password: string, mergeList: mergeListType[], headerRowId: number) {
    // 添加工作表保护
    if (password) {
      this.worksheet?.protect(password, {
        autoFilter: true,
        selectLockedCells: false
      })
    }
    // 合并单元格
    mergeList.forEach((item) => {
      // 行数为表格数据所在行行数+表头行序号headerRowId
      const startRow = item.startRow + headerRowId
      const endRow = item.endRow + headerRowId
      this.worksheet?.mergeCells(startRow, item.startColumn, endRow, item.endColumn)
    })
    // 冻结前几行
    this.worksheet!.views = [{ state: 'frozen', xSplit: 0, ySplit: headerRowId }]
  }
}
