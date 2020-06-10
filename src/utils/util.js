function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

// 格式化时间戳
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

  return arr1.map(formatNumber).join('-') + ' ' + arr2.map(formatNumber).join(':')
}

// 节流函数
export function throttle(func, wait) {
  let timeout
  return function() {
    let context = this
    let args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

export function deepClone(obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  let ret = checkType(obj) === 'Object' ? {} : []
  for (let i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      if (checkType(obj[i]) === 'Object' || checkType(obj[i]) === 'Array') {
        ret[i] = deepClone(obj[i])
      } else {
        ret[i] = obj[i]
      }
    }
  }
  return ret
}
