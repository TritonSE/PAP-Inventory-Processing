import { APIResult, handleAPIError, get } from "@/api/requests";
// import { MongoClient, Document } from 'mongodb';
export interface FurnitureItemJson {
  _id: string;
  category: string;
  name: string;
  isGasElectric: boolean;
  allowMultiple: boolean;
  categoryIndex: number;
}
export interface FurnitureItem {
  _id: string;
  category: string;
  name: string;
  isGasElectric: boolean;
  allowMultiple: boolean;
  categoryIndex: number;
}

function parseFurnitureItem(furnitureItem: FurnitureItemJson) {
  return {
    _id: furnitureItem._id,
    category: furnitureItem.category,
    name: furnitureItem.name,
    isGasElectric: furnitureItem.isGasElectric,
    allowMultiple: furnitureItem.allowMultiple,
    categoryIndex: furnitureItem.categoryIndex,
  };
}
export async function getFurnitureItems(): Promise<APIResult<FurnitureItem[]>> {
  try {
    const response = await get(`/api/furnitureItems`);
    console.log(response);
    const json = (await response.json()) as FurnitureItemJson[];
    console.log("JSON\n", json);
    const furnitureItems = json.map(parseFurnitureItem);
    return { success: true, data: furnitureItems };
  } catch (error) {
    return handleAPIError(error);
  }
}
