const serialNumberOptions = [
  {
    minValue: 1,
    maxValue: 1,
    points: 500,
  },
  {
    minValue: 2,
    maxValue: 5,
    points: 100,
  },
  {
    minValue: 6,
    maxValue: 10,
    points: 50,
  },
  {
    minValue: 11,
    maxValue: 100,
    points: 25,
  },
]

const getTokenSerialNumberPoints = (serialNumber: number) => {
  let p = 0

  serialNumberOptions.forEach(({ minValue, maxValue, points }) => {
    if (serialNumber >= minValue && serialNumber <= maxValue) p += points
  })

  return p
}

export default getTokenSerialNumberPoints
