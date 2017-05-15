function phpCastString (value) {
  var type = typeof value

  switch (type) {
    case 'boolean':
      return value ? '1' : ''
    case 'string':
      return value
    case 'number':
      if (isNaN(value)) {
        return 'NAN'
      }

      if (!isFinite(value)) {
        return (value < 0 ? '-' : '') + 'INF'
      }

      return value + ''
    case 'undefined':
      return ''
    case 'object':
      if (Array.isArray(value)) {
        return 'Array'
      }

      if (value !== null) {
        return 'Object'
      }

      return ''
    case 'function':
      // fall through
    default:
      throw new Error('Unsupported value type')
  }
}

function strnatcmp (a, b) {
  var leadingZeros = /^0+(?=\d)/
  var whitespace = /^\s/
  var digit = /^\d/

  if (arguments.length !== 2) {
    return null
  }

  a = phpCastString(a)
  b = phpCastString(b)

  if (!a.length || !b.length) {
    return a.length - b.length
  }

  var i = 0
  var j = 0

  a = a.replace(leadingZeros, '')
  b = b.replace(leadingZeros, '')

  while (i < a.length && j < b.length) {
    // skip consecutive whitespace
    while (whitespace.test(a.charAt(i))) i++
    while (whitespace.test(b.charAt(j))) j++

    var ac = a.charAt(i)
    var bc = b.charAt(j)
    var aIsDigit = digit.test(ac)
    var bIsDigit = digit.test(bc)

    if (aIsDigit && bIsDigit) {
      var bias = 0
      var fractional = ac === '0' || bc === '0'

      do {
        if (!aIsDigit) {
          return -1
        } else if (!bIsDigit) {
          return 1
        } else if (ac < bc) {
          if (!bias) {
            bias = -1
          }

          if (fractional) {
            return -1
          }
        } else if (ac > bc) {
          if (!bias) {
            bias = 1
          }

          if (fractional) {
            return 1
          }
        }

        ac = a.charAt(++i)
        bc = b.charAt(++j)

        aIsDigit = digit.test(ac)
        bIsDigit = digit.test(bc)
      } while (aIsDigit || bIsDigit)

      if (!fractional && bias) {
        return bias
      }

      continue
    }

    if (!ac || !bc) {
      continue
    } else if (ac < bc) {
      return -1
    } else if (ac > bc) {
      return 1
    }

    i++
    j++
  }

  var iBeforeStrEnd = i < a.length
  var jBeforeStrEnd = j < b.length

  // Check which string ended first
  // return -1 if a, 1 if b, 0 otherwise
  return (iBeforeStrEnd > jBeforeStrEnd) - (iBeforeStrEnd < jBeforeStrEnd)
}

module.exports = {
  strnatcmp: strnatcmp
}
