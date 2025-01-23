import { fetchService } from "@/boot/fetch-service";
import { UserData } from "@/store/user-slice";

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

export async function resetPassword(data: resetPasswordInput) {
  try {
    const result = await fetchService("auth/reset-password", {
      method: "POST",
      body: data,
    });

    return result;
  } catch {
    return;
  }
}
export async function logOut() {
  try {
    const result = await fetchService("auth/logout", {
      method: "POST",
    });

    return result;
  } catch {
    return;
  }
}

export async function getMe(): Promise<UserData> {
  try {
    const result = await fetchService("user");
    return result;
  } catch {
    throw new Error("You need to log in")
  }
}

export async function getUsers(): Promise<UserData[]> {
  try {
    const result = await fetchService("user/all-users");
    return result;
  } catch {
    return [];
  }
}

export interface resetPasswordInput {
  identifier: string;
  resetCode: number;
  newPassword: string;
}

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
