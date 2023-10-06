import colors from 'tailwindcss/colors'

const availableColors = Object.keys(colors)

function generateGradientByTailwindClass(baseColor = 'gray') {
  const matchColor = colors[baseColor] || colors.gray

  return `linear-gradient(180deg, ${matchColor[300]} 0%,${matchColor[400]} 20%, ${matchColor[500]} 50%,${matchColor[600]} 50%,  ${matchColor[700]} 100%)`
}

function getTailwindColorHex(baseColor = 'gray', weight = 400) {
  const tailwindColor = colors[baseColor] || colors.gray
  return tailwindColor[weight]
}

function getRandomColor() {
  const availableColorsKeys = Object.keys(getAvailableColors())
  const value = Math.floor(Math.random() * (availableColorsKeys.length - 0 + 1) + 0)
  return availableColorsKeys[value]
}

function getAvailableColors() {
  const newColors = {}

  for (const color of availableColors) {
    if (typeof colors[color] === 'object') {
      newColors[color] = colors[color]
    }
  }

  return newColors
}

export { getRandomColor, getAvailableColors, getTailwindColorHex, generateGradientByTailwindClass }
