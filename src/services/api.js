import client from './client'
export const auth = {
    signUp: payload => client.post('/auth/signup', payload),
    signIn: payload => client.post('/auth/signin', payload)
}
export const chat = {
    getConversations: ({ shopId, pageNumber, rowPage }) => client.get(`/conversations/${shopId}?pageNumber=${pageNumber}&rowPage=${rowPage}`),
    deleteConversation: conversationId => client.delete(`/conversations/messages/${conversationId}`),
    getMessages: conversationId => client.get(`/conversations/messages/${conversationId}`),
    searchMessage: payload => client.post('/conversations/search', payload)
}

export const bot = {
    getBotConfig: shopId => client.get(`/bot-config/${shopId}`),
    getKeyWord: shopId => client.get(`/keyword/${shopId}`),
    updateBotConfig: ({ shopId, config }) => client.put(`/bot-config/${shopId}`, config),
    addBotConfig: ({ shopId, config }) => client.post(`/bot-config/${shopId}`, config),
    addKeyWord: (keyword) => client.post(`/keyword`, keyword),
    deleteKeyWord: ({ shopId, keyword }) => client.put(`/keyword/${shopId}`, keyword)
}
