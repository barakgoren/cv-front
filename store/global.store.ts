import { create } from 'zustand';

interface GlobalState {
    selectedItems: any[];
    setSelectedItems: (items: any[]) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
    selectedItems: [],
    setSelectedItems: (items: any[]) => set({ selectedItems: items })
}));

export default useGlobalStore;