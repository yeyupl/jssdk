function urlencode (str) {
  str = (str + '')
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+')
}

function urldecode (str) {
  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function () {
      return '%25'
    })
    .replace(/\+/g, '%20'))
}

function http_build_query (formdata, numericPrefix, argSeparator) { 
  var value
  var key
  var tmp = []

  var _httpBuildQueryHelper = function (key, val, argSeparator) {
    var k
    var tmp = []
    if (val === true) {
      val = '1'
    } else if (val === false) {
      val = '0'
    }
    if (val !== null) {
      if (typeof val === 'object') {
        for (k in val) {
          if (val[k] !== null) {
            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
          }
        }
        return tmp.join(argSeparator)
      } else if (typeof val !== 'function') {
        return urlencode(key) + '=' + urlencode(val)
      } else {
        throw new Error('There was an error processing for http_build_query().')
      }
    } else {
      return ''
    }
  }

  if (!argSeparator) {
    argSeparator = '&'
  }
  for (key in formdata) {
    value = formdata[key]
    if (numericPrefix && !isNaN(key)) {
      key = String(numericPrefix) + key
    }
    var query = _httpBuildQueryHelper(key, value, argSeparator)
    if (query !== '') {
      tmp.push(query)
    }
  }

  return tmp.join(argSeparator)
}

module.exports = {
  http_build_query: http_build_query,
  urlencode:urlencode,
  urldecode:urldecode
}