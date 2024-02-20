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
  } = useForm<IFormInput>();
  const [selectedEthnicity, setSelectedEthnicity] = useState("");

  const [otherEthnicity, setOtherEthnicity] = useState("");
  const [finalEthnicity, setFinalEthnicity] = useState("");

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
  //const showOtherTextbox = selectedEthnicity?.length === 0 || selectedEthnicity === undefined;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // Construct the request object
    const createVSRRequest: CreateVSRRequest = {
      name: data.name,
      date: new Date().toISOString().slice(0, 10),
      gender: data.gender,
      age: data.age,
      maritalStatus: data.marital_status,
      spouseName: data.spouse,
      agesOfBoys: data.ages_of_boys.slice(0, numBoys),
      agesOfGirls: data.ages_of_girls.slice(0, numGirls),
      ethnicity: finalEthnicity,
      employmentStatus: data.employment_status,
      incomeLevel: data.income_level,
      sizeOfHome: data.size_of_home,
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
                <div className={styles.longText}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    placeholder="e.g. Justin Timberlake"
                    {...register("name", { required: "Name is required" })}
                    onChange={(e) => console.log("Errors and watch", errors, watch())}
                    required={true}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
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
                          required={true}
                          error={!!errors.gender}
                          helperText={errors.gender?.message}
                        />
                      )}
                    />
                  </div>
                  <div className={styles.longText}>
                    <TextField
                      label="Age"
                      variant="outlined"
                      placeholder="Enter your age"
                      {...register("age", { required: "Age is required" })}
                      onChange={(e) => console.log("Errors and watch", errors, watch())}
                      required={true}
                      error={!!errors.age}
                      helperText={errors.age?.message}
                    />
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
                        required={true}
                        error={!!errors.marital_status}
                        helperText={errors.marital_status?.message}
                      />
                    )}
                  />
                  <div className={styles.longText}>
                    <TextField
                      label="Spouse's Name"
                      variant="outlined"
                      placeholder="e.g. Jane Timberlake"
                      {...register("spouse", {})}
                      onChange={(e) => console.log("Errors and watch", errors, watch())}
                      required={false}
                      error={!!errors.spouse}
                      helperText={errors.spouse?.message}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.longText}>
                    <TextField
                      label="Number of Boys"
                      variant="outlined"
                      placeholder="e.g. 2"
                      {...register("num_boys", {
                        required: "Number of boys is required",
                        valueAsNumber: true, // Ensure the value is treated as a number
                        setValueAs: (value) => {
                          //Need to fix (make OnChange function?)? Issue: If I input 5 then 3 for num boys,
                          //the data will make an array with 3 values then two null like:
                          //[2, 4, 6, null, null] rather than just [2, 4, 6]
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
                </div>
                <div className={styles.numChildren}>
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

                <div className={styles.formRow}>
                  <div className={styles.longText}>
                    <TextField
                      label="Number of Girls"
                      variant="outlined"
                      placeholder="e.g. 2"
                      {...register("num_girls", {
                        required: "Number of girls is required",
                        valueAsNumber: true, // Ensure the value is treated as a number
                        setValueAs: (value) => {
                          //Need to fix (make OnChange function?)? Issue: If I input 5 then 3 for num boys,
                          //the data will make an array with 3 values then two null like:
                          //[2, 4, 6, null, null] rather than just [2, 4, 6]
                          // Convert the input value to a number and check if it exceeds 20
                          const intValue = parseInt(value);
                          if (intValue > 20) {
                            return 20; // Return 20 if the input value exceeds 20
                          }
                          return intValue > 0 ? intValue : 0; // Ensure negative values are not accepted, return 0 as a fallback
                        },
                      })}
                      {...register("num_girls", { required: "Number of girls is required" })}
                      onChange={(e) => {
                        console.log("Errors and watch", errors, watch());
                        //if number is greater than 20, set it to 20, and set form value to 20
                        if (parseInt(e.target.value) > 20) {
                          setNumGirls(20);
                        } else {
                          setNumGirls(parseInt(e.target.value));
                        }
                      }}
                      required={true}
                      error={!!errors.num_girls}
                      helperText={errors.num_girls?.message}
                    />
                  </div>
                </div>

                <div className={styles.numChildren}>
                  {Array.from({ length: numGirls }, (_, index) => (
                    <div key={index}>
                      <TextField
                        label={`Child #${index + 1} Age`}
                        variant="outlined"
                        {...register(`ages_of_girls.${index}`, {
                          required: "This field is required",
                          valueAsNumber: true, // Ensures the value is treated as a number
                        })}
                        error={!!errors.ages_of_girls?.[index]}
                        helperText={errors.ages_of_girls?.[index] ? "This field is required" : ""}
                        required={true}
                      />
                    </div>
                  ))}
                </div>

                <div className={styles.numChildren}></div>
                <div className={styles.numChildren}></div>

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
                        setOtherEthnicity("");
                        setSelectedEthnicity(newValue);

                        if (newValue === "") {
                          setFinalEthnicity(otherEthnicity);
                        } else {
                          setFinalEthnicity(newValue);
                        }
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
                    if (selectedEthnicity === "") {
                      setFinalEthnicity(value);
                    } else {
                      setFinalEthnicity(selectedEthnicity);
                    }
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
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.submitButton}>
              <button className={styles.submit} type="submit">
                Submit
              </button>
            </div>
            <PageNumber pageNum={1} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default VeteranServiceRequest;
