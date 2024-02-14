"use client";
import React, { useState } from "react";
import styles from "src/app/vsr/page.module.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TextField from "@/components/TextField";
import MultipleChoice from "@/components/MultipleChoice";
import Dropdown from "@/components/Dropdown";
import HeaderBar from "@/components/HeaderBar";
import * as validators from "@/util/validateResponses";
import { createVSR, CreateVSRRequest } from "@/api/VSRs";

interface IFormInput {
  name: string;
  date: string;
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
}

const VeteranServiceRequest: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IFormInput>();
  const selectedEthnicity = watch("ethnicity");
  const [otherEthnicity, setOtherEthnicity] = useState("");

  const [numBoys, setNumBoys] = useState(0);
  const [numGirls, setNumGirls] = useState(0);

  console.log("selected", selectedEthnicity);
  const maritalOptions = ["Married", "Single", "Widow/Widower", "It's Complicated"];
  const genderOptions = ["", "Male", "Female", "Other"];
  const employmentOptions = [
    "Employed",
    "Unemployed",
    "Currently Looking",
    "Retired",
    "In School",
    "Unable to work",
    "Other",
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

  // Determine if the "Other" textbox should be shown
  const showOtherTextbox =
    selectedEthnicity === "Other" ||
    selectedEthnicity?.includes("Other") ||
    selectedEthnicity?.length === 0 ||
    selectedEthnicity === undefined;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // Construct the request object
    const createVSRRequest: CreateVSRRequest = {
      name: data.name,
      date: new Date().toISOString().slice(0, 10),
      gender: data.gender,
      age: data.age,
      maritalStatus: data.marital_status,
      ethnicity: data.ethnicity, // You'll need to add fields for these if they are required
      employmentStatus: data.employment_status,
      incomeLevel: data.income_level,
      sizeOfHome: data.size_of_home,
      agesOfBoys: data.ages_of_boys,
    };

    try {
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
        <HeaderBar />
        <div className={styles.main}>
          <h1>Veteran Service Request Form</h1>
          <p className={styles.description}>
            Welcome, Veterans, Active Duty, and Reservists. We invite you to schedule an appointment
            to explore a selection of household furnishings and essential items available in our
            warehouse.
            <br></br>
            <br></br>
            Let us know your specific needs, and we'll provide the best assistance possible. Expect
            a response within 48 business hours; remember to check your junk mail if needed.
            <br></br>
            <br></br>
            If you're a Veteran or Active Military Reservist in search of our services, simply fill
            out and submit the form below.
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
                <TextField
                  label="Name"
                  variant="outlined"
                  {...register("name", { required: "Name is required" })}
                  onChange={(e) => console.log("Errors and watch", errors, watch())}
                  required={true}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <div className={styles.formRow}>
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
                        required={true}
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                      />
                    )}
                  />

                  <TextField
                    label="Age"
                    variant="outlined"
                    {...register("age", { required: "Age is required" })}
                    onChange={(e) => console.log("Errors and watch", errors, watch())}
                    required={true}
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
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
                        required={true}
                        error={!!errors.marital_status}
                        helperText={errors.marital_status?.message}
                      />
                    )}
                  />
                  <TextField
                    label="Spouse's Name"
                    variant="outlined"
                    {...register("spouse", {})}
                    onChange={(e) => console.log("Errors and watch", errors, watch())}
                    required={false}
                    error={!!errors.spouse}
                    helperText={errors.spouse?.message}
                  />
                </div>

                <div className={styles.formRow}>
                  <TextField
                    label="Number of Boys"
                    variant="outlined"
                    {...register("num_boys", {
                      required: "Number of boys is required",
                      valueAsNumber: true, // Ensure the value is treated as a number
                      setValueAs: (value) => {
                        // Convert the input value to a number and check if it exceeds 20
                        const intValue = parseInt(value);
                        if (intValue > 20) {
                          return 20; // Return 20 if the input value exceeds 20
                        }
                        return intValue > 0 ? intValue : 0; // Ensure negative values are not accepted, return 0 as a fallback
                      },
                    })}
                    {...register("num_boys", { required: "Number of boys is required" })}
                    onChange={(e) => {
                      console.log("Errors and watch", errors, watch());
                      //if number is greater than 20, set it to 20, and set form value to 20
                      if (parseInt(e.target.value) > 20) {
                        setNumBoys(20);
                      } else {
                        setNumBoys(parseInt(e.target.value));
                      }
                    }}
                    required={true}
                    error={!!errors.num_boys}
                    helperText={errors.num_boys?.message}
                  />
                </div>
                <div className={styles.formRow}>
                  {Array.from({ length: numBoys }, (_, index) => (
                    <div key={index}>
                      <TextField
                        label={`Child #${index + 1} Age`}
                        variant="outlined"
                        {...register(`ages_of_boys.${index}`, {
                          required: "This field is required",
                          valueAsNumber: true, // Ensures the value is treated as a number
                        })}
                        error={!!errors.ages_of_boys?.[index]}
                        helperText={errors.ages_of_boys?.[index] ? "This field is required" : ""}
                        required={true}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.formRow}></div>
                <div className={styles.formRow}></div>

                <Controller
                  name="ethnicity"
                  control={control}
                  //rules={{ required: "Ethnicity is required" }}
                  render={({ field }) => (
                    <MultipleChoice
                      label="Ethnicity"
                      options={ethnicityOptions} // Make sure this array includes an "Other" option
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                        // If "Other" is not selected and there was a value in the otherEthnicity state, clear it
                        setOtherEthnicity("");
                        //setValue("ethnicity", "", { shouldValidate: true });
                      }}
                      required={false}
                      error={!!errors.ethnicity}
                      helperText={errors.ethnicity?.message}
                    />
                  )}
                />

                <TextField
                  type="text"
                  placeholder="Please specify"
                  name="other_ethnicity"
                  value={otherEthnicity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOtherEthnicity(value);
                  }}
                  required={!selectedEthnicity || selectedEthnicity.length === 0}
                  label={""}
                  variant={"outlined"}
                />

                {errors.ethnicity && <p>{errors.ethnicity.message}</p>}

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
                      required={true}
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
                      required={true}
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
                      required={true}
                      error={!!errors.size_of_home}
                      helperText={errors.size_of_home?.message}
                    />
                  )}
                />

                <div>
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VeteranServiceRequest;
