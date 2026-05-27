interface Payload {
  email: string;
  password: string;
  name?: string;
}

export const login = async (payload: Payload) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const register = async (payload: Payload) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
