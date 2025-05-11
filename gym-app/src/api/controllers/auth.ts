import { customCommand } from "@/api/customFetch";
import { useRouter } from "next/navigation";

export type registerCommand = {
  email: string;
  password: string;
};

export type forgotPasswordCommand = {
  email: string;
};

export type resetPasswordCommand = {
  token: string;
  email: string;
  password: string;
};

export type signInCommand = {
  email: string;
  password: string;
};

export type signInResponse = {
  accessToken: string;
};

export async function signIn(command: signInCommand, router: ReturnType<typeof useRouter>): Promise<signInResponse> {
  const response = await customCommand("auth/login", "POST", router, command);
  return response.json();
}

export async function register(command: registerCommand, router: ReturnType<typeof useRouter>) {
  await customCommand<registerCommand>("auth/register", "POST", router, command);
}

export async function forgotPassword(command: forgotPasswordCommand, router: ReturnType<typeof useRouter>) {
  await customCommand<forgotPasswordCommand>("auth/forgot-password", "POST", router, command);
}

export async function resetPassword(command: resetPasswordCommand, router: ReturnType<typeof useRouter>) {
  await customCommand<resetPasswordCommand>("auth/reset-password", "POST", router, command);
}
