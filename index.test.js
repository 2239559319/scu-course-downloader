const { getDepartmentValue, download } = require('./index.js')

describe('department and coruse test', () => {
  test('department', async () => {
    const list = await getDepartmentValue()
    expect(list.length).not.toBeFalsy()
    expect(list).toContainEqual({
      name: '数学学院',
      value: '201'
    })
  })

  test('courses', async () => {
    const courses = await download('201', '2020-2021-1-1')
    expect(courses.length).toBeGreaterThan(10)
  })
})
