import {create} from 'zustand';

const useChatStore = create((set) => ({
  selectedChat: null,
  chatMessages: [],
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setChatMessages: (messages) => set({ chatMessages: messages }),
}));

export default useChatStore;
