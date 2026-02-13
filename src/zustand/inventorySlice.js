import { create } from "zustand";

const useInventorySlice = create((set) => ({
  // Pagination state
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  // Set pagination
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }), // Reset to page 1 when limit changes
  setPagination: (pagination) =>
    set({
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: pagination.totalPages || 0,
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

export default useInventorySlice;

