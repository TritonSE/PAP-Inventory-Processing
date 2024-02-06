"use client";
import React from "react";
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
  age: number;
  ethnicity: string;
  employment_status: string;
  income_level: string;
  size_of_home: string;
}

const VeteranServiceRequest: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();
  const maritalOptions = ["Married", "Single", "It's Complicated"];
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
      <HeaderBar />
      <div className={styles.main}>
        <h1>Veteran Service Request Form</h1>
        <p className={styles.description}>
          Welcome, Veterans, Active Duty, and Reservists. We invite you to schedule an appointment
          to explore a selection of household furnishings and essential items available in our
          warehouse.
          <br></br>
          <br></br>
          Let us know your specific needs, and we'll provide the best assistance possible. Expect a
          response within 48 business hours; remember to check your junk mail if needed.
          <br></br>
          <br></br>
          If you're a Veteran or Active Military Reservist in search of our services, simply fill
          out and submit the form below.
        </p>

        <div className={styles.footer}>
          <p>
            Fields marked with <span className={styles.asterisk}>*</span> are required.
          </p>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.form}>
            <form onSubmit={handleSubmit(onSubmit)}>
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

              {/* <TextField
          label="Date"
          variant="outlined"
          {...register("date", {
            validate: {
              date: (value) =>
                validators.validateDate(value) == "Success" || "Date is not in the correct format",
            },
          })}
          
          error={!!errors.date}
          helperText={errors.date?.message}
        /> */}
              <Controller
                name="ethnicity"
                control={control}
                rules={{ required: "Ethnicity is required" }}
                render={({ field }) => (
                  <MultipleChoice
                    label="Ethnicity"
                    options={ethnicityOptions}
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    required={true}
                    error={!!errors.ethnicity}
                    helperText={errors.ethnicity?.message}
                  />
                )}
              />

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

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeteranServiceRequest;

// "use client";

// import React, {useState, ChangeEvent} from "react";
// import TextField from '@/components/TextField';
// import MultipleChoice from '@/components/MultipleChoice';
// import Dropdown from '@/components/Dropdown';
// import { SelectChangeEvent } from "@mui/material";
// import * as validators from '@/util/validateResponses';

// const VeteranServiceRequest = () => {
//     const [formValues, setFormValues] = useState({
//         name: '',
//         gender: '',
//         marital_status: ''
//     });
//     const maritalOptions = ["Married", "Single", "It's Complicated"]
//     const genderOptions = ["Male", "Female", "Other"]

//     const [errors, setErrors] = useState({});

//     const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormValues(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleDropdownChange = (e: SelectChangeEvent) => {
//         const name = e.target.name as keyof typeof formValues; // Ensures 'name' is a valid key of 'formValues'
//         const value = e.target.value;

//         if (name) {
//           setFormValues(prev => ({
//             ...prev,
//             [name]: value
//           }));
//         }
//       };

//     const handleChoiceChange = (field: string, value: string) => {
//         setFormValues(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
//         e.preventDefault();
//         // Perform validation here and update the errors state as necessary, then submit to backend

//         console.log(formValues);
//     };

//     return (
//         <div style={{ backgroundColor: 'white' }}>
//             <h1>Veteran Service Request Form Page 1</h1>
//             <form>
//                 <TextField
//                     name = "name"
//                     label = "Name"
//                     variant = "outlined"
//                     value = {formValues.name}
//                     onChange={handleTextChange}
//                 />

//                 <div>
//                     {/* Just to divide things for now */}
//                     <br/>
//                     <br/>
//                 </div>

//                 <MultipleChoice
//                     name = "marital_status"
//                     label = "Marital Status"
//                     options = {maritalOptions}
//                     value= {formValues.marital_status}
//                     onChange={(newValue) => handleChoiceChange('marital_status', newValue)}
//                 />

//                 <div>
//                      {/* Just to divide things for now */}
//                     <br/>
//                     <br/>
//                 </div>

//                 <Dropdown
//                     name = "gender"
//                     label = "Gender"
//                     options={genderOptions}
//                     value={formValues.gender}
//                     onChange={handleDropdownChange}
//                 />

//             </form>
//         </div>
//     )
// }

// export default VeteranServiceRequest;
