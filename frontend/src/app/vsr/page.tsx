"use client";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TextField from "@/components/TextField";
import MultipleChoice from "@/components/MultipleChoice";
import Dropdown from "@/components/Dropdown";
import * as validators from "@/util/validateResponses";
import { createVSR, CreateVSRRequest } from "@/api/VSRs";

interface IFormInput {
  name: string;
  date: string;
  marital_status: string;
  gender: string;
}

// const handleSubmit = () => {
//   // first, do any validation that we can on the frontend
//   //todo

//   let createVSRRequest: CreateVSRRequest = {
//     name: "",
//     date: "",
//     gender: "",
//     age: 0,
//     maritalStatus: "",
//     ethnicity: "",
//     employmentStatus: "",
//     incomeLevel: "",
//     sizeOfHome: "",
//   };

//   createVSR(createVSRRequest).then((result) => {
//     if (result.success) {
//     } else {
//       // You should always clearly inform the user when something goes wrong.
//       // In this case, we're just doing an `alert()` for brevity, but you'd
//       // generally want to show some kind of error state or notification
//       // within your UI. If the problem is with the user's input, then use
//       // the error states of your smaller components (like the `TextField`s).
//       // If the problem is something we don't really control, such as network
//       // issues or an unexpected exception on the server side, then use a
//       // banner, modal, popup, or similar.
//       alert(result.error);
//     }
//   });
// };

const VeteranServiceRequest: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();
  const maritalOptions = ["Married", "Single", "It's Complicated"];
  const genderOptions = ["Male", "Female", "Other"];

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // Construct the request object
    let createVSRRequest: CreateVSRRequest = {
      name: data.name,
      date: data.date,
      gender: data.gender,
      age: 42,
      maritalStatus: data.marital_status,
      ethnicity: "PLACEHOLDER", // You'll need to add fields for these if they are required
      employmentStatus: "PLACEHOLDER",
      incomeLevel: "PLACEHOLDER",
      sizeOfHome: "PLACEHOLDER",
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
    <div style={{ backgroundColor: "white" }}>
      <h1>Veteran Service Request Form Page 1</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          variant="outlined"
          {...register("name", { required: "Name is required" })}
          onChange={(e) => console.log("Errors and watch", errors, watch())}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <div>
          <br />
          <br />
        </div>

        <TextField
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
        />

        <div>
          <br />
          <br />
        </div>

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
              error={!!errors.marital_status}
              helperText={errors.marital_status?.message}
            />
          )}
        />

        <div>
          <br />
          <br />
        </div>

        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <Dropdown
              label="Gender"
              options={genderOptions}
              value={field.value}
              onChange={(e) => field.onChange(e)}
              error={!!errors.gender}
              helperText={errors.gender?.message}
            />
          )}
        />

        <button type="submit">Submit</button>
      </form>
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
