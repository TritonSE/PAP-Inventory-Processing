import { APIResult, handleAPIError, post } from "@/api/requests";

export interface VSRJson {
  _id: string;
  name: string;
  date: Date;
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
  address: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  militaryBranch: string;
  militaryConflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petInterest: boolean;
  referralSource: string;
}

export interface VSR {
  _id: string;
  name: string;
  date: string;
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
  address: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  militaryBranch: string;
  militaryConflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petInterest: boolean;
  referralSource: string;
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
  address: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  militaryBranch: string;
  militaryConflicts: string[];
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petInterest: boolean;
  referralSource: string;
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
    address: vsr.address,
    city: vsr.city,
    state: vsr.state,
    zipCode: vsr.zipCode,
    phoneNumber: vsr.phoneNumber,
    email: vsr.email,
    militaryBranch: vsr.militaryBranch,
    militaryConflicts: vsr.militaryConflicts,
    dischargeStatus: vsr.dischargeStatus,
    serviceConnected: vsr.serviceConnected,
    lastRank: vsr.lastRank,
    militaryID: vsr.militaryID,
    petInterest: vsr.petInterest,
    referralSource: vsr.referralSource,
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
