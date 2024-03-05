import { APIResult, handleAPIError, post, get } from "@/api/requests";

/*

 name: { type: String, required: true },
  date: { type: Date, required: true },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  maritalStatus: { type: String, required: true },
  spouseName: { type: String },
  agesOfBoys: { type: [Number] },
  agesOfGirls: { type: [Number] },
  ethnicity: { type: String, require: true },
  employmentStatus: { type: String, require: true },
  incomeLevel: { type: String, require: true },
  sizeOfHome: { type: String, require: true },*/
export interface VSRJson {
  _id: string;
  name: string;
  date: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName?: string;
  agesOfBoys?: number[];
  agesOfGirls?: number[];
  ethnicity: string;
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
  serviceConnected: string;
  lastRank: string;
  militaryId: number;
  petCompanion: string;
  bedroomFurnishing: string[];
  bathroomFurnishing: string[];
  kitchenFurnishing: string[];
  livingRoomFurnishing: string[];
  diningRoomFurnishing: string[];
  otherFurnishing: string[];
  caseId: string;
  dateReceived: string;
  lastUpdated: string;
  status: string;
  hearFrom: string;
}

export interface VSR {
  _id: string;
  name: string;
  date: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName?: string;
  agesOfBoys?: number[];
  agesOfGirls?: number[];
  ethnicity: string;
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
  serviceConnected: string;
  lastRank: string;
  militaryId: number;
  petCompanion: string;
  bedroomFurnishing: string[];
  bathroomFurnishing: string[];
  kitchenFurnishing: string[];
  livingRoomFurnishing: string[];
  diningRoomFurnishing: string[];
  otherFurnishing: string[];
  caseId: string;
  dateReceived: string;
  lastUpdated: string;
  status: string;
  hearFrom: string;
}

export interface CreateVSRRequest {
  name: string;
  date: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName?: string;
  agesOfBoys?: number[];
  agesOfGirls?: number[];
  ethnicity: string;
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
  serviceConnected: string;
  lastRank: string;
  militaryId: number;
  petCompanion: string;
  bedroomFurnishing: object[];
  bathroomFurnishing: object[];
  kitchenFurnishing: object[];
  livingRoomFurnishing: object[];
  diningRoomFurnishing: object[];
  otherFurnishing: object[];
  caseId: string;
  dateReceived: string;
  lastUpdated: string;
  status: string;
  hearFrom: string;
}

function parseVSR(vsr: VSRJson) {
  return {
    _id: vsr._id,
    name: vsr.name,
    date: new Date(vsr.date).toISOString(),
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
    caseId: vsr.caseId,
    dateReceived: vsr.dateReceived,
    lastUpdated: vsr.lastUpdated,
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

export async function getVSR(id: string): Promise<APIResult<VSR>> {
  try {
    const response = await get(`/api/vsr/${id}`);
    const json = (await response.json()) as VSRJson;
    return { success: true, data: parseVSR(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}
