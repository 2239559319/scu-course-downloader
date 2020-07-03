# 四川大学课表下载程序nodejs版
## 迁移到此项目
- [python版本](https://github.com/2239559319/courseDownload)不再维护，以后将只维护这个版本
## 使用
```shell
yarn add scu-course-downloader
#or
npm install scu-course-downloader
```
```javascript
const { saveToExcel } = require('scu-course-downloader')

;(async() => {
  await saveToExcel()
})()
```
下载途中会输出相应的信息
## 和以前版本的比较
减少了请求速度更快