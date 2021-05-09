function convertParams(params) {
    const paramsObj = {}
    for (const [key, value] of params.entries()) {
        paramsObj[key] = value;
    }
    return paramsObj
}

module.exports = { convertParams }