import client from './client'
export const auth = {
    signUp: payload => client.post('/auth/signup', payload),
    signIn: payload => client.post('/auth/signin', payload)
}
export const chat = {
    getConversations: ({ storeId, pageNumber, rowPage }) => client.get(`/conversations/${storeId}?pageNumber=${pageNumber}&rowPage=${rowPage}`),
    getMessages: conversationId => client.get(`/conversations/messages/${conversationId}`)
}
