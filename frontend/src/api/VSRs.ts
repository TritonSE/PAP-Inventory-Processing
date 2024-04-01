import { APIResult, get, handleAPIError, httpDelete, patch, post } from "@/api/requests";
import { createAuthHeader } from "@/api/Users";

export interface FurnitureInput {
  furnitureItemId: string;
  quantity: number;
}

export interface VSRJson {
  _id: string;
  name: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName?: string;
  agesOfBoys: number[];
  agesOfGirls: number[];
  ethnicity: string[];
  employmentStatus: string;
  incomeLevel: string;
  sizeOfHome: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  branch: string[];
  conflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petCompanion: boolean;
  selectedFurnitureItems: FurnitureInput[];
  additionalItems: string;
  dateReceived: string;
  lastUpdated: string;
  status: string;
  hearFrom: string;
}

export interface VSRListJson {
  vsrs: VSRJson[];
}

export interface VSR {
  _id: string;
  name: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName?: string;
  agesOfBoys: number[];
  agesOfGirls: number[];
  ethnicity: string[];
  employmentStatus: string;
  incomeLevel: string;
  sizeOfHome: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  branch: string[];
  conflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petCompanion: boolean;
  selectedFurnitureItems: FurnitureInput[];
  additionalItems: string;
  dateReceived: Date;
  lastUpdated: Date;
  status: string;
  hearFrom: string;
}

export interface CreateVSRRequest {
  name: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName?: string;
  agesOfBoys: number[];
  agesOfGirls: number[];
  ethnicity: string[];
  employmentStatus: string;
  incomeLevel: string;
  sizeOfHome: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  branch: string[];
  conflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petCompanion: boolean;
  hearFrom: string;
  selectedFurnitureItems: FurnitureInput[];
  additionalItems: string;
}

function parseVSR(vsr: VSRJson) {
  return {
    _id: vsr._id,
    name: vsr.name,
    gender: vsr.gender,
    age: vsr.age,
    maritalStatus: vsr.maritalStatus,
    spouseName: vsr.spouseName,
    agesOfBoys: vsr.agesOfBoys,
    agesOfGirls: vsr.agesOfGirls,
    ethnicity: vsr.ethnicity,
    employmentStatus: vsr.employmentStatus,
    incomeLevel: vsr.incomeLevel,
    sizeOfHome: vsr.sizeOfHome,
    streetAddress: vsr.streetAddress,
    city: vsr.city,
    state: vsr.state,
    zipCode: vsr.zipCode,
    phoneNumber: vsr.phoneNumber,
    email: vsr.email,
    branch: vsr.branch,
    conflicts: vsr.conflicts,
    dischargeStatus: vsr.dischargeStatus,
    serviceConnected: vsr.serviceConnected,
    lastRank: vsr.lastRank,
    militaryID: vsr.militaryID,
    petCompanion: vsr.petCompanion,
    selectedFurnitureItems: vsr.selectedFurnitureItems,
    additionalItems: vsr.additionalItems,
    dateReceived: new Date(vsr.dateReceived),
    lastUpdated: new Date(vsr.lastUpdated),
    status: vsr.status,
    hearFrom: vsr.hearFrom,
  };
}

export async function createVSR(vsr: CreateVSRRequest): Promise<APIResult<VSR>> {
  try {
    const response = await post("/api/vsr", vsr);
    const json = (await response.json()) as VSRJson;
    return { success: true, data: parseVSR(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllVSRs(firebaseToken: string): Promise<APIResult<VSR[]>> {
  try {
    const response = await get("/api/vsr", createAuthHeader(firebaseToken));
    const json = (await response.json()) as VSRListJson;
    return { success: true, data: json.vsrs.map(parseVSR) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getVSR(id: string, firebaseToken: string): Promise<APIResult<VSR>> {
  try {
    const response = await get(`/api/vsr/${id}`, createAuthHeader(firebaseToken));
    const json = (await response.json()) as VSRJson;
    return { success: true, data: parseVSR(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function updateVSRStatus(
  id: string,
  status: string,
  firebaseToken: string,
): Promise<APIResult<VSR>> {
  try {
    const response = await patch(
      `/api/vsr/${id}/status`,
      { status },
      createAuthHeader(firebaseToken),
    );
    const json = (await response.json()) as VSRJson;
    return { success: true, data: parseVSR(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function deleteVSR(id: string, firebaseToken: string): Promise<APIResult<null>> {
  try {
    await httpDelete(`/api/vsr/${id}`, createAuthHeader(firebaseToken));
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
