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

export const getMatchRoute = (route, name) => {
  const splitRoute = route.split('/')
  return splitRoute.includes(name)
}

export const getErrorMsg = (errorStr) => {

  if (errorStr.indexOf('user rejected transaction') !== -1) {
    return 'user rejected transaction'
  }

  const flag = 'evm: execution reverted:'
  const flagIndex = String(errorStr).indexOf(flag)
  if (flagIndex !== -1) {
    const afterFlagStr = errorStr.substring(flagIndex)
    const endIndex = afterFlagStr.indexOf(',')
    return errorStr.substring(flagIndex, flagIndex + endIndex - 1)
  } else {
    return errorStr
  }
}

export const calEAARate = (globalRank) => {
  const EAA_PM_STEP = 1, EAA_RANK_STEP = 100000, EAA_PM_START = 100
  const decrease = Math.floor((EAA_PM_STEP * globalRank) / EAA_RANK_STEP)

  if (decrease > EAA_PM_START) return 0;
  return EAA_PM_START - decrease
}