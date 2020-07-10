declare module 'scu-course-downloader' {
  interface Department {
    name: string
    value: string
  }
  /**
   * 保存学院请求数据
   */
  export function getDepartmentValue<T extends Department>(): Promise<T>
  /**
   * 下载指定学院的课表
   * @param kkxs 学院号(数据)
   * @param term 学期字符串
   * @returns 一个学院一学期的课表
   */
  export function download(kkxs: string, term: string): Promise<Array<any>>
  /**
   * 下载到excel
   * @param term 学期字符串
   * @returns void
   */
  export function saveToExcel(term: string): Promise<void>
}
