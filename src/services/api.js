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
