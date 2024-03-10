// EditPage.tsx
import React, { useEffect, useState } from "react";
import styles from "src/components/EditVSR/editPage.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { VSR, UpdateVSRRequest, updateVSR, getVSR } from "@/api/VSRs";

interface IFormInput {
  name: string;
  marital_status: string;
  gender: string;
  spouse: string;
  age: number;
  ethnicity: string;
  employment_status: string;
  income_level: string;
  size_of_home: string;
  num_boys: number;
  num_girls: number;
  ages_of_boys: number[];
  ages_of_girls: number[];
}

interface EditPageProps {
  vsr: VSR; // Assuming VSR is the type for your VSR data
}

const EditPage: React.FC<EditPageProps> = ({ vsr }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currVsr, setVSR] = useState<VSR>({} as VSR);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: vsr.name || "",
      marital_status: vsr.maritalStatus || "",
      gender: vsr.gender || "",
      spouse: vsr.spouseName || "",
      age: vsr.age || 0,
      ethnicity: vsr.ethnicity && vsr.ethnicity.length > 0 ? vsr.ethnicity[0] : "",
      employment_status: vsr.employmentStatus || "",
      income_level: vsr.incomeLevel || "",
      size_of_home: vsr.sizeOfHome || "",
      num_boys: vsr.agesOfBoys ? vsr.agesOfBoys.length : 0,
      num_girls: vsr.agesOfGirls ? vsr.agesOfGirls.length : 0,
      ages_of_boys: vsr.agesOfBoys || [],
      ages_of_girls: vsr.agesOfGirls || [],
    },
  });


  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    

    // Make your API call here
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <button onClick={toggleEditing}>{isEditing ? "Cancel" : "Edit"}</button>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("name")} defaultValue={vsr.name || ""} />
          <input {...register("marital_status")} defaultValue={vsr.maritalStatus || ""} />
          <input {...register("gender")} defaultValue={vsr.gender || ""} />
          <input {...register("spouse")} defaultValue={vsr.spouseName || ""} />
          <input {...register("age")} defaultValue={vsr.age || 0} />
          <input
            {...register("ethnicity")}
            defaultValue={vsr.ethnicity && vsr.ethnicity.length > 0 ? vsr.ethnicity[0] : ""}
          />
          <input {...register("employment_status")} defaultValue={vsr.employmentStatus || ""} />
          <input {...register("income_level")} defaultValue={vsr.incomeLevel || ""} />
          <input {...register("size_of_home")} defaultValue={vsr.sizeOfHome || ""} />
          <input
            {...register("num_boys")}
            defaultValue={vsr.agesOfBoys ? vsr.agesOfBoys.length : 0}
          />
          <input
            {...register("num_girls")}
            defaultValue={vsr.agesOfGirls ? vsr.agesOfGirls.length : 0}
          />
          {/* You may need to map through ages_of_boys and ages_of_girls if they are arrays */}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>{/* Render your VSR data here */}</div>
      )}
    </div>
  );
};

export default EditPage;
