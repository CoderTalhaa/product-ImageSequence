import { create } from "zustand";

const useThreeStore = create((set) => ({
  containerRef: null,
  setContainerRef: (ref) => set({ containerRef: ref }),
  isComplete: false,
  setIsComplete: (value) => set({ isComplete: value }),
  isSize: false,
  setIsSize: (value) => set({ isSize: value }),
  isColor: "#091057",
  setIsColor: (value) => set({ isColor: value }),
}));

export default useThreeStore;
