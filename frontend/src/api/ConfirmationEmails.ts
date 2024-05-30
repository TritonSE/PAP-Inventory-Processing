import { createAuthHeader } from "@/api/Users";
import { APIResult, get, handleAPIError, put } from "@/api/requests";

export interface ConfirmationEmail {
  html: string;
  papLogoHTML: string;
}

export const getConfirmationEmail = async (
  firebaseToken: string,
): Promise<APIResult<ConfirmationEmail>> => {
  try {
    const response = await get("/api/confirmationEmail", createAuthHeader(firebaseToken));
    const json = (await response.json()) as ConfirmationEmail;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};

export const updateConfirmationEmail = async (
  firebaseToken: string,
  newHTML: string,
): Promise<APIResult<ConfirmationEmail>> => {
  try {
    const response = await put(
      `/api/confirmationEmail`,
      { html: newHTML },
      createAuthHeader(firebaseToken),
    );
    const json = (await response.json()) as ConfirmationEmail;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
};
