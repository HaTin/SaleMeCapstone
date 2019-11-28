const knex = require('../configs/knex-config')
const util = require('../utilities/util')

const getConfiguration = async (storeId) => {
    const result = await knex('BotConfiguration').where({ storeId })
    .select('id', 'botName', 'storeId', 'textColor', 'backgroundColor', 'configDate', 'intro', 'liveChat','requireEmail', 'requirePhone')
    const response = util.createObj(result, 'botConfig')
    return response
}

const updateConfiguration = async (storeId, data) => {
    const { botName, textColor, backgroundColor, configDate, intro, liveChat, requireEmail, requirePhone } = data
    const result = await knex('BotConfiguration').where({ storeId }).update({
        botName, textColor, backgroundColor, configDate, intro, liveChat, requireEmail, requirePhone
    }, ['botName', 'textColor', 'backgroundColor', 'configDate', 'intro', 'liveChat','requireEmail', 'requirePhone'])
    const response = util.createObj(result, 'botConfig')
    return response
}

const saveConfiguration = async (data) => {
    console.log(data)
    const result = await knex('BotConfiguration').returning(['id', 'storeId']).insert(data)
    const response = util.createObj(result, 'botConfig');
    return response
}
module.exports = {
    getConfiguration,
    updateConfiguration,
    saveConfiguration
}