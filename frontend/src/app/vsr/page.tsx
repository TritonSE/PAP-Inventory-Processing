"use client";
import React, { useState } from "react";
import styles from "src/app/vsr/page.module.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TextField from "@/components/TextField";
import MultipleChoice from "@/components/MultipleChoice";
import Dropdown from "@/components/Dropdown";
import HeaderBar from "@/components/HeaderBar";
import PageNumber from "@/components/PageNumber";
import { createVSR, CreateVSRRequest } from "@/api/VSRs";

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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Construct the request object
    const createVSRRequest: CreateVSRRequest = {
      name: data.name,
      gender: data.gender,
      age: data.age,
      maritalStatus: data.marital_status,
      spouseName: data.spouse,
      agesOfBoys:
        data.ages_of_boys
          ?.slice(0, data.num_boys)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      agesOfGirls:
        data.ages_of_girls
          ?.slice(0, data.num_girls)
          .map((age) => (typeof age === "number" ? age : parseInt(age))) ?? [],
      ethnicity: selectedEthnicities.concat(otherEthnicity === "" ? [] : [otherEthnicity]),
      employmentStatus: data.employment_status,
      incomeLevel: data.income_level,
      sizeOfHome: data.size_of_home,
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
                message: "This field must be a number no greater than 100",
              },
            })}
            required
            error={!!errors[`num_${gender}s`]}
            helperText={errors[`num_${gender}s`]?.message}
          />
        </div>

        <div className={styles.numChildren}>
          {Array.from({ length: numChildrenThisGender }, (_, index) => (
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
            Let us know your specific needs, and we&apos;ll provide the best assistance possible.
            Expect a response within 48 business hours; remember to check your junk mail if needed.
            <br></br>
            <br></br>
            If you&apos;re a Veteran or Active Military Reservist in search of our services, simply
            fill out and submit the form below.
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
                      variant="outlined"
                      placeholder="Enter your age"
                      {...register("age", {
                        required: "Age is required",
                        min: {
                          value: 0,
                          message: "This field must be positive",
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
                <div className={styles.formRow}>
                  <div className={styles.longText}>
                    <TextField
                      label="Spouse's Name"
                      variant="outlined"
                      placeholder="e.g. Jane Timberlake"
                      {...register("spouse", {
                        required:
                          watch().marital_status === "Married" && "Spouse's Name is required",
                      })}
                      required={watch().marital_status === "Married"}
                      error={!!errors.spouse}
                      helperText={errors.spouse?.message}
                    />
                  </div>
                  {/* Add an empty div here with flex: 1 to take up the right half of the row */}
                  <div style={{ flex: 1 }} />
                </div>

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
              Submit
            </button>
          </div>
          <PageNumber pageNum={1} />
        </div>
      </form>
    </div>
  );
};

export default VeteranServiceRequest;
