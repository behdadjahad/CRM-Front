import { fetchService } from "@/boot/fetch-service";

export async function login(data: LoginInput): Promise<LoginOutput> {
  try {
    const result: LoginOutput = await fetchService("auth/login", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return loginStaticOutput;
  }
}

export async function forgetPassword(
  data: forgotPasswordInput
): Promise<forgotPasswordOutput> {
  try {
    const result = await fetchService("auth/forgot-password", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return forgetPasswordStaticOutput;
  }
}

export async function resetPassword(
  data: resetPasswordInput
): Promise<resetPasswordOutput> {
  try {
    const result = await fetchService("auth/reset-password", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return resetPasswordStaticOutput;
  }
}

export interface resetPasswordInput {
  identifier: string;
  resetCode: string;
  resetPassword: string;
}

export interface resetPasswordOutput {}

const resetPasswordStaticOutput: resetPasswordOutput = {};

export interface forgotPasswordInput {
  identifier: string;
}

export interface forgotPasswordOutput {
  resetCode: string;
  expiredAt: string;
}

const forgetPasswordStaticOutput: forgotPasswordOutput = {
  resetCode: "",
  expiredAt: "",
};

export interface LoginInput {
  usernameOrUniqueId: string;
  password: string;
}

export interface LoginOutput {
  success: boolean;
  accessToken: string;
  data: {
    accessToken: string;
  };
}

const loginStaticOutput: LoginOutput = {
  accessToken: "",
  data: {
    accessToken: "",
  },
  success: false,
};
