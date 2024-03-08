"use client";
import React, { useEffect, useState } from "react";
// import { MultipleChoice, TextField } from "@/components/VeteranForm";
import { HeaderBar } from "@/components/VSRIndividual";
import SelectAll from "@/components/VeteranForm/SelectAll";
import TextField from "@/components/VeteranForm/TextField";
import PageNumber from "@/components/VeteranForm/PageNumber";
import styles from "src/app/vsr/page.module.css";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CreateVSRRequest, createVSR } from "@/api/VSRs";
import Dropdown from "@/components/VeteranForm/Dropdown/index";
import MultipleChoice from "@/components/VeteranForm/MultipleChoice/index";

interface IFormInput {
  name: string;
  marital_status: string;
  gender: string;
  spouse: string;
  age: number;
  ethnicity: string;
  other_ethnicity: string;
  employment_status: string;
  income_level: string;
  size_of_home: string;
  num_boys: number;
  num_girls: number;
  ages_of_boys: number[];
  ages_of_girls: number[];
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
}

const VeteranServiceRequest: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([]);
  const [otherEthnicity, setOtherEthnicity] = useState("");

  const [selectedConflicts, setSelectedConflicts] = useState<string[]>([]);
  const [otherConflict, setOtherConflict] = useState("");

  const [selectedBranch, setSelectedBranch] = useState<string[]>([]);

  const [selectedHearFrom, setSelectedHearFrom] = useState("");
  const [otherHearFrom, setOtherHearFrom] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  const numBoys = watch("num_boys");
  const numGirls = watch("num_girls");

  const maritalOptions = ["Married", "Single", "It's Complicated", "Widowed/Widower"];
  const genderOptions = ["Male", "Female", "Other"];
  const employmentOptions = [
    "Employed",
    "Unemployed",
    "Currently Looking",
    "Retired",
    "In School",
    "Unable to work",
  ];

  const incomeOptions = [
    "$12,500 and under",
    "$12,501 - $25,000",
    "$25,001 - $50,000",
    "$50,001 and over",
  ];

  const homeOptions = [
    "House",
    "Apartment",
    "Studio",
    "1 Bedroom",
    "2 Bedroom",
    "3 Bedroom",
    "4 Bedroom",
    "4+ Bedroom",
  ];

  const ethnicityOptions = [
    "Asian",
    "African American",
    "Caucasian",
    "Native American",
    "Pacific Islander",
    "Middle Eastern",
    "Prefer not to say",
  ];

  const branchOptions = [
    "Air Force",
    "Air Force Reserve",
    "Air National Guard",
    "Army",
    "Army Air Corps",
    "Army Reserve",
    "Coast Guard",
    "Marine Corps",
    "Navy",
    "Navy Reserve",
  ];

  const conflictsOptions = [
    "WWII",
    "Korea",
    "Vietnam",
    "Persian Gulf",
    "Bosnia",
    "Kosovo",
    "Panama",
    "Kuwait",
    "Iraq",
    "Somalia",
    "Desert Shield/Storm",
    "Operation Enduring Freedom (OEF)",
    "Afghanistan",
    "Irani Crisis",
    "Granada",
    "Lebanon",
    "Beirut",
    "Special Ops",
    "Peactime",
  ];

  const dischargeStatusOptions = [
    "Honorable Discharge",
    "General Under Honorable",
    "Other Than Honorable",
    "Bad Conduct",
    "Entry Level",
    "Dishonorable",
    "Still Serving",
    "Civilian",
    "Medical",
    "Not Given",
  ];

  const hearFromOptions = ["Colleague", "Social Worker", "Friend", "Internet", "Social Media"];

  const stateOptions = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<FurnitureItem[]>([]);
  const [bedroomFurnishings, setBedroomFurnishings] = useState<FurnitureItem[]>([]);
  const [bathroomFurnishings, setBathroomFurnishings] = useState<FurnitureItem[]>([]);
  const [kitchenFurnishings, setKitchenFurnishings] = useState<FurnitureItem[]>([]);
  const [livingRoomFurnishings, setLivingRoomFurnishings] = useState<FurnitureItem[]>([]);
  const [diningRoomFurnishings, setDiningRoomFurnishings] = useState<FurnitureItem[]>([]);
  const [otherFurnishings, setOtherFurnishings] = useState<FurnitureItem[]>([]);

  interface FurnitureInputs {
    _id: string;
    quantity: number;
    isGasElectric: boolean;
  }

  interface CountMap {
    [key: string]: number;
  }

  type FurnitureSelection = Record<string, FurnitureInputs[]>;

  const selectionByCategory: FurnitureSelection = {
    Bedroom: [],
    Bathroom: [],
    Kitchen: [],
    "Living Room": [],
    "Drining Room": [],
    Other: [],
  };

  useEffect(() => {
    getFurnitureItems()
      .then((result) => {
        if (result.success) {
          setAllItems(result.data);
          setErrorMessage(null);
        } else {
          setErrorMessage("Furniture items not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    const bedroomItems = allItems.filter((item) => item.category === "bedroom");
    const bathroomItems = allItems.filter((item) => item.category === "bathroom");
    const kitchenItems = allItems.filter((item) => item.category === "kitchen");
    const livingRoomItems = allItems.filter((item) => item.category === "living room");
    const diningRoomItems = allItems.filter((item) => item.category === "dining room");
    const otherItems = allItems.filter((item) => item.category === "other");

    setBedroomFurnishings(bedroomItems);
    setBathroomFurnishings(bathroomItems);
    setKitchenFurnishings(kitchenItems);
    setLivingRoomFurnishings(livingRoomItems);
    setDiningRoomFurnishings(diningRoomItems);
    setOtherFurnishings(otherItems);
  }, [allItems]);

  const handleSelectionChange = (data: CountMap, category: string) => {
    console.log("HANDLING CHANGE for: ", category);
    selectionByCategory[category] = [];
    Object.entries(data).forEach(([furnitureItem, count]) => {
      const item = allItems.find((item) => item.name === furnitureItem);
      const vsrItem: FurnitureInputs = {
        _id: item ? item._id : "",
        quantity: count,
        isGasElectric: item ? item.isGasElectric : false, // This is optional
      };
      selectionByCategory[category].push(vsrItem);
    });
    console.log(selectionByCategory[category]);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Construct the request object
    const createVSRRequest: CreateVSRRequest = {
      name: "Sophia Yu",
      gender: "Female",
      age: 20,
      maritalStatus: "Signel",
      spouseName: "N/A",
      agesOfBoys:
        data.ages_of_boys
          ?.slice(0, data.num_boys)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      agesOfGirls:
        data.ages_of_girls
          ?.slice(0, data.num_girls)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      ethnicity: "Asian",
      employmentStatus: "Unemployed",
      incomeLevel: "$12,500 - $25,000",
      sizeOfHome: "Apartment",
      streetAddress: "1111 TSE Lane",
      city: "San Diego",
      state: "CA",
      zipCode: 92122,
      phoneNumber: "123-456-7890",
      email: "tsepapdev@gmail.com",
      branch: ["Navy", "Air Force"],
      conflicts: [],
      dischargeStatus: "Still Serving",
      serviceConnected: true,
      lastRank: "Officer",
      militaryId: 2932,
      petCompanion: true,
      hearFrom: "Social Media",
      date: "2020-05-18T14:10:30.000+00:00",
      bedroomFurnishing: selectionByCategory["Bedroom"],
      bathroomFurnishing: selectionByCategory["Bathroom"],
      kitchenFurnishing: selectionByCategory["Kitchen"],
      livingRoomFurnishing: selectionByCategory["Living Room"],
      diningRoomFurnishing: selectionByCategory["Dining Room"],
      otherFurnishing: selectionByCategory["Other"],
      caseId: "0000",
      dateReceived: "2020-05-18T14:10:30.000+00:00",
      lastUpdated: "2020-05-18T14:10:30.000+00:00",
      status: "Received",
    };

    try {
      const response = await createVSR(createVSRRequest);

      if (!response.success) {
        // TODO: better way of displaying error
        throw new Error(`HTTP error! status: ${response.error}`);
      }

      // TODO: better way of displaying successful submission (popup/modal)
      alert("VSR submitted successfully!");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const incrementPageNumber = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(pageNumber + 1);
  };

  const decrementPageNumber = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(pageNumber - 1);
  };

  const renderChildInput = (gender: "boy" | "girl") => {
    const numChildrenThisGender = gender === "boy" ? numBoys : numGirls;

    return (
      <>
        <div className={styles.longText}>
          <TextField
            label={`Number of ${gender}(s)`}
            variant="outlined"
            placeholder="e.g. 2"
            type="number"
            {...register(`num_${gender}s`, {
              required: `Number of ${gender}s is required`,
              pattern: {
                // Only allow up to 2 digits
                value: /^[0-9][0-9]?$/,
                message: "This field must be a number less than 100",
              },
            })}
            required
            error={!!errors[`num_${gender}s`]}
            helperText={errors[`num_${gender}s`]?.message}
          />
        </div>

        <div className={styles.numChildren}>
          {/* Cap it at 99 children per gender to avoid freezing web browser */}
          {Array.from({ length: Math.min(numChildrenThisGender, 99) }, (_, index) => (
            <div key={index} className={styles.childInputWrapper}>
              <TextField
                label={`Age`}
                type="number"
                variant="outlined"
                {...register(`ages_of_${gender}s.${index}`, {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "This field must be a number",
                  },
                  max: {
                    value: 17,
                    message: "Only enter children under 18",
                  },
                })}
                error={!!errors[`ages_of_${gender}s`]?.[index]}
                helperText={errors[`ages_of_${gender}s`]?.[index]?.message}
                required
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  if (pageNumber == 1) {
    return (
      <div>
        <form onSubmit={incrementPageNumber}>
          <HeaderBar />
          <div className={styles.main}>
            <h1>Veteran Service Request Form</h1>
            <p className={styles.description}>
              Welcome, Veterans, Active Duty, and Reservists. We invite you to schedule an
              appointment to explore a selection of household furnishings and essential items
              available in our warehouse.
              <br></br>
              <br></br>
              Let us know your specific needs, and we&apos;ll provide the best assistance possible.
              Expect a response within 48 business hours; remember to check your junk mail if
              needed.
              <br></br>
              <br></br>
              If you&apos;re a Veteran or Active Military Reservist in search of our services,
              simply fill out and submit the form below.
            </p>

            <div className={styles.fieldsMarked}>
              <p>
                Fields marked with <span className={styles.asterisk}>*</span> are required.
              </p>
            </div>

            <div className={styles.formContainer}>
              <div className={styles.form}>
                <div className={styles.subSec}>
                  <h1 className={styles.personalInfo}>Personal Information</h1>

                  <div className={styles.formRow}>
                    <div className={styles.longText}>
                      <TextField
                        label="Name"
                        variant="outlined"
                        placeholder="e.g. Justin Timberlake"
                        {...register("name", { required: "Name is required" })}
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </div>
                    {/* Add an empty div here with flex: 1 to take up the right half of the row */}
                    <div style={{ flex: 1 }} />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.longText}>
                      <Controller
                        defaultValue=""
                        name="gender"
                        control={control}
                        rules={{ required: "Gender is required" }}
                        render={({ field }) => (
                          <Dropdown
                            label="Gender"
                            options={genderOptions}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            required
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                            placeholder="Select your gender"
                          />
                        )}
                      />
                    </div>
                    <div className={styles.longText}>
                      <TextField
                        label="Age"
                        type="number"
                        variant="outlined"
                        placeholder="Enter your age"
                        {...register("age", {
                          required: "Age is required",
                          pattern: {
                            // Only allow up to 2 digits
                            value: /^[0-9]+$/,
                            message: "This field must be a number",
                          },
                        })}
                        required
                        error={!!errors.age}
                        helperText={errors.age?.message}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.subSec}>
                  <Controller
                    name="marital_status"
                    control={control}
                    rules={{ required: "Marital status is required" }}
                    render={({ field }) => (
                      <MultipleChoice
                        label="Marital Status"
                        options={maritalOptions}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        required
                        error={!!errors.marital_status}
                        helperText={errors.marital_status?.message}
                      />
                    )}
                  />
                  {watch().marital_status === "Married" ? (
                    <div className={styles.formRow}>
                      <div className={styles.longText}>
                        <TextField
                          label="Spouse's Name"
                          variant="outlined"
                          placeholder="e.g. Jane Timberlake"
                          {...register("spouse", {
                            required: "Spouse's Name is required",
                          })}
                          required
                          error={!!errors.spouse}
                          helperText={errors.spouse?.message}
                        />
                      </div>
                      {/* Add an empty div here with flex: 1 to take up the right half of the row */}
                      <div style={{ flex: 1 }} />
                    </div>
                  ) : null}

                  <p className={styles.sectionHeader}>Children (under 18)</p>

                  <div className={styles.formRow}>
                    {renderChildInput("boy")}
                    {renderChildInput("girl")}
                  </div>
                </div>

                <Controller
                  name="ethnicity"
                  control={control}
                  rules={{ required: "Ethnicity is required" }}
                  render={({ field }) => (
                    <>
                      <MultipleChoice
                        label="Ethnicity"
                        options={ethnicityOptions}
                        value={selectedEthnicities}
                        onChange={(newValue) => {
                          const valueToSet = ((newValue as string[]) ?? [])[0] ?? "";
                          if (valueToSet !== "" || otherEthnicity === "") {
                            field.onChange(valueToSet);
                          }
                          setSelectedEthnicities(newValue as string[]);
                        }}
                        required
                        error={!!errors.ethnicity}
                        helperText={errors.ethnicity?.message}
                        allowMultiple
                      />
                      <div style={{ marginTop: -50 }}>
                        <TextField
                          label="Other"
                          type="text"
                          placeholder="Please specify"
                          name="other_ethnicity"
                          value={otherEthnicity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value !== "" || selectedEthnicities.length === 0) {
                              field.onChange(value);
                            }
                            setOtherEthnicity(value);
                          }}
                          variant={"outlined"}
                          required={false}
                        />
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="employment_status"
                  control={control}
                  rules={{ required: "Employment status is required" }}
                  render={({ field }) => (
                    <MultipleChoice
                      label="Employment Status"
                      options={employmentOptions}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      required
                      error={!!errors.employment_status}
                      helperText={errors.employment_status?.message}
                    />
                  )}
                />

                <Controller
                  name="income_level"
                  control={control}
                  rules={{ required: "Income level is required" }}
                  render={({ field }) => (
                    <MultipleChoice
                      label="Income Level"
                      options={incomeOptions}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      required
                      error={!!errors.income_level}
                      helperText={errors.income_level?.message}
                    />
                  )}
                />

                <Controller
                  name="size_of_home"
                  control={control}
                  rules={{ required: "Size of home is required" }}
                  render={({ field }) => (
                    <MultipleChoice
                      label="Size of Home"
                      options={homeOptions}
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      required
                      error={!!errors.size_of_home}
                      helperText={errors.size_of_home?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className={styles.submitButton}>
              <button className={styles.submit} type="submit">
                Next
              </button>
            </div>
            <PageNumber pageNum={1} />
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className={styles.page}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HeaderBar />
          <div className={styles.canvas}>
            <div className={styles.title}>Furnishings</div>
            <div className={styles.sections}>
              <div className={styles.section}>
                <SelectAll
                  label="Bedroom"
                  options={bedroomFurnishings}
                  onChildDataChange={handleSelectionChange}
                />
              </div>
              <div className={styles.section}>
                <SelectAll
                  label="Bathroom"
                  options={bathroomFurnishings}
                  onChildDataChange={handleSelectionChange}
                />
              </div>
              <div className={styles.section}>
                <SelectAll
                  label="Kitchen"
                  options={kitchenFurnishings}
                  onChildDataChange={handleSelectionChange}
                />
              </div>
              <div className={styles.section}>
                <SelectAll
                  label="Living Room"
                  options={livingRoomFurnishings}
                  onChildDataChange={handleSelectionChange}
                />
              </div>
              <div className={styles.section}>
                <SelectAll
                  label="Dining Room"
                  options={diningRoomFurnishings}
                  onChildDataChange={handleSelectionChange}
                />
              </div>
              <div className={styles.section}>
                <SelectAll
                  label="Other"
                  options={otherFurnishings}
                  onChildDataChange={handleSelectionChange}
                />
              </div>
              <div className={styles.section}>
                <TextField
                  label="Identify other necessary items"
                  helperText="**We do not offer cleaning supplies"
                  required={false}
                  variant={"outlined"}
                ></TextField>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.backButton}>
              <button className={styles.back} onClick={decrementPageNumber}>
                Back
              </button>
            </div>
            <PageNumber pageNum={3} />
            <div className={styles.submitButton}>
              <button className={styles.submit} type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
        <div className={styles.footer}></div>
      </div>
    );
  }
};

export default VeteranServiceRequest;
