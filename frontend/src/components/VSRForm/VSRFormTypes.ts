/**
 * Common types for the VSR form (create & edit) input fields.
 */

import { FurnitureInput } from "@/api/VSRs";

export interface IVSRFormInput {
  name: string;
  maritalStatus: string;
  gender: string;
  spouseName: string;
  age: number;
  ethnicity: string[];
  other_ethnicity: string;
  employment_status: string;
  income_level: string;
  size_of_home: string;
  num_boys: number;
  num_girls: number;
  agesOfBoys: number[];
  agesOfGirls: number[];

  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: string;
  email: string;
  branch: string[];
  conflicts: string[];
  other_conflicts: string;
  dischargeStatus: string;
  serviceConnected: boolean;
  lastRank: string;
  militaryID: number;
  petCompanion: boolean;
  hearFrom: string;
  other_hearFrom: string;

  selectedFurnitureItems: Record<string, FurnitureInput>;
  additionalItems: string;
}

export interface ICreateVSRFormInput extends IVSRFormInput {
  confirmEmail: string;
}

export type IEditVSRFormInput = IVSRFormInput;
