export interface Login {
  status: string;
  message?: string | null;
  token: string;
  data: Data;
}

export interface Register {
  status: string;
  message?: string | null;
  data: Data;
}

export interface Data {
  id: string;
  email: string;
  name: string;
}
