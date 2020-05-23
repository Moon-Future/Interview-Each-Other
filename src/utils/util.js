function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime(date, num1 = 3, num2 = 3) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let arr1 = [year, month, day]
  let arr2 = [hour, minute, second]
  arr1 = arr1.filter((ele, index) => {
    return index < num1
  })
  arr2 = arr2.filter((ele, index) => {
    return index < num2
  })

  return (
    arr1.map(formatNumber).join('-') + ' ' + arr2.map(formatNumber).join(':')
  )
}
