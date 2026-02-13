import { create } from "zustand";
import { FILTER_MODES } from "../utils/filterConfig";

const createInitialFilters = () => ({
  [FILTER_MODES.DASHBOARD]: {
    search: "",
    status: "",
    startDate: null,
    endDate: null,
    period: "today", // today or week
  },
  [FILTER_MODES.ORDER_MANAGEMENT]: {
    search: "",
    date: null,
    status: "",
  },
  [FILTER_MODES.TENT_INVENTORY]: {
    search: "",
    status: "",
    category: "",
  },
  [FILTER_MODES.REPORTS]: {
    search: "",
    date: null,
    startDate: null,
    endDate: null,
    period: "month", // default period for reports
  },
});

const useFilterSliceKey = create((set) => ({
  filters: createInitialFilters(),
  
  setFilterValue: (groupKey, fieldKey, value) =>
    set((state) => {
      // If filter group doesn't exist, initialize it
      if (!state.filters[groupKey]) {
        return {
          filters: {
            ...state.filters,
            [groupKey]: {
              [fieldKey]: value,
            },
          },
        };
      }

      return {
        filters: {
          ...state.filters,
          [groupKey]: {
            ...state.filters[groupKey],
            [fieldKey]: value,
          },
        },
      };
    }),

  resetFilterGroup: (groupKey) =>
    set((state) => {
      const initialFilters = createInitialFilters();
      if (!initialFilters[groupKey]) {
        return state;
      }

      return {
        filters: {
          ...state.filters,
          [groupKey]: initialFilters[groupKey],
        },
      };
    }),

  resetAllFilters: () =>
    set({
      filters: createInitialFilters(),
    }),
}));

export { createInitialFilters };
export default useFilterSliceKey;

