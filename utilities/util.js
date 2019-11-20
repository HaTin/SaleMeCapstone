const getCurrentDatetime = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
const convertDatetime = (date) => {
    const dateObj = date ? new Date(date) : new Date()
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
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

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const makeId = (length) => {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    getCurrentDatetime,
    createObj,
    createList,
    convertDatetime,
    validateEmail,
    makeId
}