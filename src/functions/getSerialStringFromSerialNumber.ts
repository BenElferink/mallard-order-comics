const getSerialStringFromSerialNumber = (num: number) => {
  let str = num.toString()

  while (str.length < 4) {
    str = `0${str}`
  }

  return `#${str}`
}

export default getSerialStringFromSerialNumber
