import { customCommand } from "@/api/customFetch";

export type registerCommand = {
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

export async function signIn(command: signInCommand): Promise<signInResponse> {
  const response = await customCommand("auth/login", "POST", command);
  return response.json();
}

export async function register(command: registerCommand) {
  await customCommand<registerCommand>("auth/register", "POST", command);
}