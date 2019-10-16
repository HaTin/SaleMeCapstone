const knex = require('../configs/knex-config')
const util = require('../utilities/util')

const getConfiguration = async (storeId) => {
    const result = await knex('BotConfiguration').where({ storeId }).select('id', 'botName', 'storeId', 'textColor', 'backgroundColor', 'font', 'avatar')
    const response = util.createObj(result, 'botConfig')
    return response
}

const updateConfiguration = async (storeId, data) => {
    const { botName, textColor, backgroundColor, font, avatar } = data
    const result = await knex('BotConfiguration').where({ storeId }).update({
        botName, textColor, backgroundColor, font, avatar
    }, ['botName', 'textColor', 'backgroundColor', 'font', 'avatar'])
    const response = util.createObj(result, 'botConfig')
    return response
}

const saveConfiguration = async (data) => {
    const result = await knex('BotConfiguration').returning(['id', 'storeId']).insert(data)
    const response = util.createObj(result, 'botConfig');
    return response
}
module.exports = {
    getConfiguration,
    updateConfiguration,
    saveConfiguration
}