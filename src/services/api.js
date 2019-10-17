import client from './client'
export const auth = {
    signUp: payload => client.post('/auth/signup', payload),
    signIn: payload => client.post('/auth/signin', payload)
}
export const chat = {
    getConversations: storeId => client.get(`/conversations/${storeId}`),
    getMessages: conversationId => client.get(`/conversations/messages/${conversationId}`)
}
