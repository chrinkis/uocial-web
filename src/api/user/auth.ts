import type { User } from "@/models/User";
import type { ApiResponse } from "@/utils/response";
import axios from "axios";

export async function fetchUser() {
  return await axios.get<User>("/api/user");
}

export async function login(credentials: { email: string; password: string }) {
  await axios.post("/api/auth/login", credentials);
}

export async function register(credentials: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  await axios.post("/api/auth/register", credentials);
}

export async function logout() {
  await axios.post("/api/auth/logout");
}

export async function forgotPassword(credentials: { email: string }) {
  return await axios.post<ApiResponse>(
    "/api/auth/password/forgot",
    credentials,
  );
}

export async function resetPassword(credentials: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}) {
  return await axios.post<ApiResponse>("/api/auth/password/reset", credentials);
}

export async function resendVerificationEmail() {
  return await axios.post<ApiResponse>("/api/auth/email/resend-verification");
}
