import { create } from "zustand";
import { persist } from "zustand/middleware";

const useVatStore = create(
  persist(
    (set) => ({
      vatSettings: null,
      setVatSettings: (settings) => set({ vatSettings: settings }),
      clearVatSettings: () => set({ vatSettings: null }),
      getVatPercentage: () => {
        const state = useVatStore.getState();
        return state.vatSettings?.vatPercentage || 0;
      },
    }),
    {
      name: "vatSettings",
    }
  )
);

export default useVatStore;
