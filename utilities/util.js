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

const getVariantsFromMessage = (message) => {
    const variantName = message.replace(/ .*/, '')
    const variantStr = message.split(': ')[1];
    const variants = variantStr.split(/[\s,]+/)
    return { variantName, variants }
}

const calculateTotalStock = (variants) => {
    let stock = 0
    variants.forEach(v => {
        stock += v.inventory_quantity
    })
    return stock
}
const getAvailableVariants = (product, variantName) => {
    const { options, variants } = product
    const optionIndex = options.findIndex(opt => opt.name.toLowerCase() === variantName.toLowerCase())
    const optionValues = options[optionIndex].values
    const stringIndex = optionIndex + 1 + ''
    const filterdVariants = optionValues.map(value => {
        const combinedVariants = variants.filter(variant => variant[`option${stringIndex}`] === value)
        console.log(combinedVariants)
        // 
        const inventoryQuantity = combinedVariants.reduce((acc, v) => acc + v.inventory_quantity, 0)
        if (inventoryQuantity > 0) return { id: combinedVariants[0].id, name: value }
    }).filter(Boolean)
    console.log(filterdVariants)
    return filterdVariants
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const isChildArray = (products1, products2) => {
    const arr1 = products1.map(p => parseInt(p.id))
    const arr2 = products2.map(p => parseInt(p.id))
    if (arr2.length > arr1.length) return false
    const isChild = arr2.every(elem => arr1.includes(elem));
    console.log(isChild)
    return isChild
}

const checkScenarioType = () => {
    
}
module.exports = {
    getCurrentDatetime,
    isChildArray,
    createObj,
    createList,
    convertDatetime,
    validateEmail,
    makeId,
    getVariantsFromMessage,
    calculateTotalStock,
    getAvailableVariants,
    capitalize
}