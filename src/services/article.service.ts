import apiClient from "./apiClient";

export const article = {
  async getAll() {
    const response = await apiClient.get("/articles");
    return response;
  },
  async getByAuthorId(id: string) {
    return await apiClient.get(`/articles/author/${id}`);
  },
  async getById(id: string) {
    const response = await apiClient.get(`/articles/${id}`);
    return response;
  },
  async create(payload: FormData) {
    const response = await apiClient.post("/articles", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
};
