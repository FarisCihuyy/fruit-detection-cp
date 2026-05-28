import apiClient from "./apiClient";
import { Login, Register } from "./types/auth";

interface Payload {
  email: string;
  password: string;
  name?: string;
}

export const login = (payload: Payload): Promise<Login> => {
  return apiClient.post("/auth/login", payload);
};

export const register = async (payload: Payload): Promise<Register> => {
  return await apiClient.post("/auth/register", payload);
};
