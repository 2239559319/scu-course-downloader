const axios = require('axios').default
const cheerio = require('cheerio')
const xlsx = require('node-xlsx')
const qs = require('querystring')
const fs = require('fs')

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
axios.defaults.headers.common.Referer = 'http://zhjwjs.scu.edu.cn/teacher/personalSenate/giveLessonInfo/thisSemesterClassSchedule/indexPublic'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

async function getDepartmentValue() {
  const url = 'http://zhjwjs.scu.edu.cn/teacher/personalSenate/giveLessonInfo/thisSemesterClassSchedule/indexPublic'
  const res = await axios.get(url)
  const html = await res.data
  const $ = cheerio.load(html)
  const values = $('#kkxs > option').map((i, v) => {
    const value = $(v).val()
    return {
      name: $(v).text(),
      value
    }
  })
  return Array.from(values).filter(({ value }) => {
    return value !== ''
  })
}

async function download(kkxs, term) {
  const url = 'http://zhjwjs.scu.edu.cn/teacher/personalSenate/giveLessonInfo/thisSemesterClassSchedule/getCourseArragementPublic'
  const data = {
    zxjxjhh: term,
    kch: '',
    kcm: '',
    js: '',
    kkxs,
    skxq: '',
    skjc: '',
    xq: '',
    jxl: '',
    jas: '',
    pageNum: '1',
    pageSize: '2000',
    kclb: ''
  }
  const req = await axios.post(url, qs.stringify(data))
  const res = await req.data
  return res.list.records
}

async function saveToExcel(term = '2020-2021-1-1') {
  const data = []
  const header = ['开课院系', '课程号', '课程名', '课序号',
    '学分', '课程类别', '考试类型', '教师', '周次', '星期', '节次',
    '校区', '教学楼', '教室', '课容量', '学生数', '选课限制说明']
  data.push(header)
  const departments = await getDepartmentValue()
  for (const { name, value } of departments) {
    const courses = await download(value, term)
    for (const course of courses) {
      const {
        kkxsjc, kch, kcm, kxh, xf, kclbmc, kslxmc, skjs, zcsm,
        skxq, skjc, cxjc, kkxqm, jxlm, jash, bkskrl, bkskyl, xkxzsm
      } = course
      data.push([kkxsjc, kch, kcm.replace(/[\r\n;]/g), kxh, xf, kclbmc, kslxmc, skjs,
        zcsm, skxq, `${skjc}-${skjc + cxjc - 1}`, kkxqm, jxlm, jash, bkskrl,
        `${bkskrl - bkskyl}`, xkxzsm.replace(/[\r\n;]/g, '')])
    }
    console.log(`${name}已完成`)
  }
  const output = xlsx.build([{
    name: 'sheet1',
    data
  }])
  if (fs.promises) {
    await fs.promises.writeFile('course.xlsx', output, 'binary')
  } else {
    return new Promise(resolve => {
      fs.writeFile('course.xlsx', output, {
        encoding: 'binary'
      }, err => {
        if (!err) resolve()
      })
    })
  }
  console.log('全部完成')
}

module.exports = {
  getDepartmentValue,
  download,
  saveToExcel
}
