import {create} from 'zustand';

const useChatStore = create((set) => ({
  selectedChat: null,
  chatMessages: [],
  currentChatId: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setChatMessages: (messages) => set({ chatMessages: Array.isArray(messages) ? messages : [] }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  addMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
}));

export default useChatStore;
