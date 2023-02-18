export const validate = (rules, value) => {
  const res = rules.map(r => r(value))
  const item = res.find(item => item !== true)
  if (!item) {
    return {
      status: true,
      msg: ''
    }
  } else {
    return {
      status: false,
      msg: item
    }
  }
} 