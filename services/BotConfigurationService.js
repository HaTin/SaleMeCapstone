const knex = require('../configs/knex-config')
const util = require('../utilities/util')

const getConfiguration = async (shopId) => {
    const result = await knex('BotConfiguration').where({ shopId })
        .select('id', 'botName', 'shopId', 'textColor', 'backgroundColor', 'configDate', 'intro', 'liveChat', 'requireEmail', 'requirePhone')
    const response = util.createObj(result, 'botConfig')
    return response
}

const updateConfiguration = async (shopId, data) => {
    const { botName, textColor, backgroundColor, configDate, intro, liveChat, requireEmail, requirePhone } = data
    const result = await knex('BotConfiguration').where({ shopId }).update({
        botName, textColor, backgroundColor, configDate, intro, liveChat, requireEmail, requirePhone
    }, ['botName', 'textColor', 'backgroundColor', 'configDate', 'intro', 'liveChat', 'requireEmail', 'requirePhone'])
    const response = util.createObj(result, 'botConfig')
    return response
}

const saveConfiguration = async (data) => {
    console.log(data)
    const result = await knex('BotConfiguration').returning(['id', 'shopId']).insert(data)
    const response = util.createObj(result, 'botConfig');
    return response
}
module.exports = {
    getConfiguration,
    updateConfiguration,
    saveConfiguration
}