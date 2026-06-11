import { headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_BASE_URL || "http://localhost:3000";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}%{endpoint}`;

    const config: RequestInit = {
      headers: {
        "content-type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };
    const response = await fetch(url, config);

    //handle 401
    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));

      throw new Error(error.error || "Request Failed");
    }
  }

  //auth methods
  async register(userData: unknown) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ userData }),
    });
  }

  async login(email: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/api/auth/login", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }
  //user methods
  async getUsers() {
    return this.request("/api/user");
  }

  // admin methods
  async updateUserRole(userId: string, role: string) {
    return this.request(`/api/user/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  }

  async assignUserToTeam(userId: string, teamId: string) {
    return this.request(`/api/user/${userId}/team`, {
      method: "PATCH",
      body: JSON.stringify({ teamId }),
    });
  }
}
