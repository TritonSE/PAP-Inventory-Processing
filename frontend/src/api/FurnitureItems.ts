import { APIResult, handleAPIError, get, post, put, httpDelete } from "@/api/requests";
import { createAuthHeader } from "@/api/Users";

export interface FurnitureItem {
  _id: string;
  category: string;
  name: string;
  allowMultiple: boolean;
  categoryIndex: number;
}

export async function getFurnitureItems(): Promise<APIResult<FurnitureItem[]>> {
  try {
    const response = await get(`/api/furnitureItems`);
    const json = (await response.json()) as FurnitureItem[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function addFurnitureItem(
  furnitureItem: FurnitureItem,
  firebaseToken: string,
): Promise<APIResult<FurnitureItem>> {
  try {
    const response = await post(
      `/api/furnitureItems`,
      furnitureItem,
      createAuthHeader(firebaseToken),
    );
    const json = (await response.json()) as FurnitureItem;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateFurnitureItem(
  id: string,
  furnitureItem: FurnitureItem,
  firebaseToken: string,
): Promise<APIResult<FurnitureItem>> {
  try {
    const response = await put(
      `/api/furnitureItems/${id}`,
      furnitureItem,
      createAuthHeader(firebaseToken),
    );
    const json = (await response.json()) as FurnitureItem;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function deleteFurnitureItem(
  id: string,
  firebaseToken: string,
): Promise<APIResult<null>> {
  try {
    await httpDelete(`/api/furnitureItems/${id}`, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
