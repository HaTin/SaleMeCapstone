const knex = require('../configs/knex-config')
const util = require('../utilities/util')

const saveKeyword = async (data) => {
    const {shopId, keyword} = data
    const isExistKeyword = checkExist(shopId, keyword)
    let result = null
    if(isExistKeyword) {
        result = await knex('ShopKeyword').where({ shopId:shopId, keyword: keyword }).update({isActive: 1})
    } else {
        result = await knex('ShopKeyword').returning(['id', 'keyword']).insert(data)
    }
    const response = util.createObj(result, 'keyword')
    return response
}

const getActiveKeywords = async (shopId) => {
    const result = await knex('ShopKeyword').where({ shopId:shopId, isActive: 1 })
        .select('id', 'keyword')
    const response = util.createList(result,'keywords')
    return response
}

const deactiveKeyword = async (shopId, data) => {
    const result = await knex('ShopKeyword').where({ shopId:shopId, keyword: data.keyword }).update({isActive: 0})
    const response = util.createObj(result, 'keyword')
    return response
}

const checkExist = async (shopId, keyword) => {
    const result = await knex('ShopKeyword').where({shopId:shopId, keyword: keyword}).first('id','keyword')
    return result
}

module.exports = {
    saveKeyword,
    getActiveKeywords,
    deactiveKeyword,
}