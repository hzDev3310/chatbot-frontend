import {create} from 'zustand';

const useChatStore = create((set) => ({
  selectedChat: null,
  chatMessages: [],
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setChatMessages: (messages) => set({ chatMessages: Array.isArray(messages) ? messages : [] }),
  addMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
}));

export default useChatStore;
