import { APIResult, get, handleAPIError, httpDelete, patch, post } from "@/api/requests";
import { User as FirebaseUser } from "firebase/auth";

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

export const changeUserPassword = async (
  uid: string,
  password: string,
  firebaseToken: string,
): Promise<APIResult<FirebaseUser>> => {
  try {
    const response = await patch(
      `/api/user/${uid}/password`,
      { password },
      createAuthHeader(firebaseToken),
    );
    const json = (await response.json()) as FirebaseUser;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const notifyResetPassword = async (firebaseToken: string): Promise<APIResult<null>> => {
  try {
    await post("/api/user/notifyResetPassword", {}, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const deleteUser = async (uid: string, firebaseToken: string): Promise<APIResult<null>> => {
  try {
    await httpDelete(`/api/user/${uid}`, createAuthHeader(firebaseToken));
    return { success: true, data: null };
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
