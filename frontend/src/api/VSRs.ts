import { APIResult, handleAPIError, post } from "@/api/requests";

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
  militaryId: number;
  petCompanion: boolean;
  bedroomFurnishing: string[];
  bathroomFurnishing: string[];
  kitchenFurnishing: string[];
  livingRoomFurnishing: string[];
  diningRoomFurnishing: string[];
  otherFurnishing: string[];
  dateReceived: string;
  lastUpdated: string;
  status: string;
  hearFrom: string;
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
  militaryId: number;
  petCompanion: boolean;
  bedroomFurnishing: string[];
  bathroomFurnishing: string[];
  kitchenFurnishing: string[];
  livingRoomFurnishing: string[];
  diningRoomFurnishing: string[];
  otherFurnishing: string[];
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

  // Comment-out page 2 & 3 fields for now because they're not implemented on the form yet
  // streetAddress: string;
  // city: string;
  // state: string;
  // zipCode: number;
  // phoneNumber: string;
  // email: string;
  // branch: string[];
  // conflicts: string[];
  // dischargeStatus: string;
  // serviceConnected: boolean;
  // lastRank: string;
  // militaryId: number;
  // petCompanion: boolean;
  // bedroomFurnishing: string[];
  // bathroomFurnishing: string[];
  // kitchenFurnishing: string[];
  // livingRoomFurnishing: string[];
  // diningRoomFurnishing: string[];
  // otherFurnishing: string[];
  // status: string;
  // hearFrom: string;
}

//similar interface to CreateVSRRequest, but with _id field
export interface UpdateVSRRequest {
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

  // Comment-out page 2 & 3 fields for now because they're not implemented on the form yet
  // streetAddress: string;
  // city: string;
  // state: string;
  // zipCode: number;
  // phoneNumber: string;
  // email: string;
  // branch: string[];
  // conflicts: string[];
  // dischargeStatus: string;
  // serviceConnected: boolean;
  // lastRank: string;
  // militaryId: number;
  // petCompanion: boolean;
  // bedroomFurnishing: string[];
  // bathroomFurnishing: string[];
  // kitchenFurnishing: string[];
  // livingRoomFurnishing: string[];
  // diningRoomFurnishing: string[];
  // otherFurnishing: string[];
  // status: string;
  // hearFrom: string;
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
    militaryId: vsr.militaryId,
    petCompanion: vsr.petCompanion,
    bedroomFurnishing: vsr.bedroomFurnishing,
    bathroomFurnishing: vsr.bathroomFurnishing,
    kitchenFurnishing: vsr.kitchenFurnishing,
    livingRoomFurnishing: vsr.livingRoomFurnishing,
    diningRoomFurnishing: vsr.diningRoomFurnishing,
    otherFurnishing: vsr.otherFurnishing,
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

export async function updateVSR(vsr: UpdateVSRRequest): Promise<APIResult<VSR>> {
  try {
    const response = await post("/api/vsr/update", vsr);
    const json = (await response.json()) as VSRJson;
    return { success: true, data: parseVSR(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getVSR(id: string): Promise<APIResult<VSR>> {
  try {
    const response = await fetch(`/api/vsr/${id}`);
    const json = (await response.json()) as VSRJson;
    return { success: true, data: parseVSR(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
