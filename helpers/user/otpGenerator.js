const codeGenerator = (length) => {
  let output = ''

  if (length > 0) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    for (let i = 0; i < length; i++) {
      let word = characters[Math.floor(Math.random() * characters.length)]

      output += word
    }

    return output
  } else {
    return false
  }
}

module.exports = codeGenerator
