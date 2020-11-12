var loaderUtils = require('loader-utils');

module.exports = function (source) {
    var options = loaderUtils.getOptions(this)
    if (!('isDebug' in options)) {
        options.isDebug = process.env.NODE_ENV === 'development'; //默认的isDebug
    }
    const res = replaceMatched(source, options)
    return res
};


function replaceMatched (source, options) {
  const data = source.replace(/#define\((\w+)\)/g, (match, $1) => {
    return process.env[$1] || ''
  });

  return data.replace(/\/\*\s*IF(DEBUG|TRUE_\w+)(?:\s*\*\/)?([\s\S]+?)(?:\/\*\s*)?FI\1\s*\*\//g, (match, $1, $2) => {
    
    let isKeep;
    if ($1 === 'DEBUG') {
      isKeep = options.isDebug
    } else {
      isKeep = options[$1.slice(5)]
    }
    return isKeep ? $2 : ''
  });
}
