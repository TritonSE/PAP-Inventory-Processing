import { APIResult, handleAPIError, get } from "@/api/requests";
export interface FurnitureItemJson {
  _id: string;
  category: string;
  name: string;
  allowMultiple: boolean;
  categoryIndex: number;
}
export interface FurnitureItem {
  _id: string;
  category: string;
  name: string;
  allowMultiple: boolean;
  categoryIndex: number;
}

function parseFurnitureItem(furnitureItem: FurnitureItemJson) {
  return {
    _id: furnitureItem._id,
    category: furnitureItem.category,
    name: furnitureItem.name,
    allowMultiple: furnitureItem.allowMultiple,
    categoryIndex: furnitureItem.categoryIndex,
  };
}
export async function getFurnitureItems(): Promise<APIResult<FurnitureItem[]>> {
  try {
    const response = await get(`/api/furnitureItems`);
    const json = (await response.json()) as FurnitureItemJson[];
    const furnitureItems = json.map(parseFurnitureItem);
    return { success: true, data: furnitureItems };
  } catch (error) {
    return handleAPIError(error);
  }
}
