import ENDPOINTS from "../endpoints";
import api from "../index";

const getBlogs = () => {
  return api(ENDPOINTS.getBlogs, null, "get");
};

const addBlog = (payload) => api(ENDPOINTS.addBlog, payload, "post");

const updateBlog = (id, payload) =>
  api(`${ENDPOINTS.updateBlog}/${id}`, payload, "put");

const deleteBlog = (id) =>
  api(`${ENDPOINTS.deleteBlog}/${id}`, null, "delete");

const getBlogById = (id) =>
  api(`${ENDPOINTS.getBlogById}/${id}`, null, "get");

export {
  getBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
};
