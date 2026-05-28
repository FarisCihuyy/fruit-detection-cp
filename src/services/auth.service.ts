import apiClient from "./apiClient";

interface Payload {
  email: string;
  password: string;
  name?: string;
}

export const login = async (payload: Payload) => {
  const response = await apiClient.post("/auth/login", payload);
  return response;
};

export const register = async (payload: Payload) => {
  const response = await apiClient.post("/auth/register", payload);
  return response;
};
