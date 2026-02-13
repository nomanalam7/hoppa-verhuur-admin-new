import { create } from "zustand";

const useOrderSlice = create((set) => ({
  // Pagination state
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  // Set page
  setPage: (page) => set({ page }),

  // Set limit & reset page
  setLimit: (limit) =>
    set({
      limit,
      page: 1,
    }),

  // Set full pagination from API response
  setPagination: (pagination = {}) =>
    set({
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 10,
      total: pagination.total ?? 0,
      totalPages: pagination.totalPages ?? 0,
    }),

  // Reset pagination
  resetPagination: () =>
    set({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }),
}));

export default useOrderSlice;
