const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const saveStore = async (data) => {
    data.timeInstall = util.getCurrentDatetime()
    const result = await knex('store').returning(['id', 'timeInstall', 'name']).insert(data)
    const response = util.createObj(result, 'store')
    return response
}

const isStoreExisted = async (name, id) => {
    const queryObj = {}
    if (name) {
        queryObj.name = name
    } if (id) {
        queryObj.id = id
    }
    const result = await knex('store').where(queryObj).first('id', 'name', 'token')
    return result
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