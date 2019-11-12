const getCurrentDatetime = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
const convertDatetime = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}
const createObj = (obj, key) => {
    obj[key + ''] = obj['0']
    const newObj = {}
    newObj[key + ''] = obj['0']
    return newObj
}
const createList = (obj, key) => {
    return { [key + '']: Object.values(obj) }
}
module.exports = {
    getCurrentDatetime,
    createObj,
    createList,
    convertDatetime
}