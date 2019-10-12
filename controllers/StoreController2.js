const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const saveStore = async (data) => {
    data.timeInstall = util.getCurrentDatetime()
    const result = await knex('store').returning(['id', 'timeInstall', 'name']).insert(data)
    const response = util.createObj(result, 'store')
    return response
}

const isStoreExisted = async (name) => {
    const result = await knex('store').where({ name }).select('id')
    return result.length > 0
}

const getStores = async () => {
    const result = await knex('store').select('id', 'name', 'timeInstall', 'isActive', 'timeUninstall')
    const response = util.createList(result, 'stores')
    return response
}
module.exports = {
    saveStore,
    getStores,
    isStoreExisted
}