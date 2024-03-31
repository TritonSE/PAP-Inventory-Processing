import { APIResult, get, handleAPIError } from "@/api/requests";

export interface User {
  _id: string;
  uid: string;
  role: string;
}

export const getWhoAmI = async (firebaseToken: string): Promise<APIResult<User>> => {
  try {
    const response = await get("/api/user/whoami", { Authorization: `Bearer ${firebaseToken}` });
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};
