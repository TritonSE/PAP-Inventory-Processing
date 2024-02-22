"use client";
import { CreateVSRRequest, createVSR } from "@/api/VSRs";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  name: string;
  date: string;
  gender: string;
  age: number;
  maritalStatus: string;
  spouseName: string;
  agesOfBoys: number[];
  agesOfGirls: number[];
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

export default function Home() {
  const { handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    // Construct the request object
    console.log("ON SUBMIT HELLO");
    const createVSRRequest: CreateVSRRequest = {
      name: "Sophia Yu",
      date: new Date().toISOString().slice(0, 10),
      gender: "Female",
      age: 20,
      maritalStatus: "Single",
      spouseName: "N/A",
      agesOfBoys: [],
      agesOfGirls: [],
      ethnicity: "Asian",
      employmentStatus: "Employed",
      incomeLevel: "$12,5000 - $25,000",
      sizeOfHome: "House",
      streetAddress: "Street Address",
      city: "San Diego",
      state: "CA",
      zipCode: 92130,
      phoneNumber: "number",
      email: "email",
      branch: [],
      conflicts: [],
      dischargeStatus: "",
      serviceConnected: "",
      lastRank: "",
      militaryId: 0,
      petCompanion: "",
      bedroomFurnishing: [],
      bathroomFurnishing: [],
      kitchenFurnishing: [],
      livingRoomFurnishing: [],
      diningRoomFurnishing: [],
      otherFurnishing: [],
      caseId: "",
      dateReceived: "",
      lastUpdated: "",
      status: "Received",
      hearFrom: "",
    };

    try {
      console.log(createVSRRequest);
      const response = await createVSR(createVSRRequest);

      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.error}`);
      }

      const responseJson = await response.data;
      console.log(responseJson);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
