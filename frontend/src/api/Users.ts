import { APIResult, get, handleAPIError, post } from "@/api/requests";

export interface User {
  _id: string;
  uid: string;
  role: string;
}

export interface DisplayUser {
  _id: string;
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

export const getWhoAmI = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    const response = await get("/api/user/whoami", createAuthHeader(firebaseToken));
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const getAllUsers = async (firebaseToken: string): Promise<APIResult<DisplayUser[]>> => {
  try {
    const response = await get("/api/user", createAuthHeader(firebaseToken));
    const json = (await response.json()) as DisplayUser[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const createUser = async (
  firebaseToken: string,
  request: CreateUserRequest,
): Promise<APIResult<User>> => {
  try {
    const response = await post("/api/user", request, createAuthHeader(firebaseToken));
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};
