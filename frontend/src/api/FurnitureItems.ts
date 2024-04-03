import { APIResult, handleAPIError, get } from "@/api/requests";

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
