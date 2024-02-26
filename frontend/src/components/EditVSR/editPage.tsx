"use client";
import React, { useState } from "react";
import styles from "src/components/EditVSR/editPage.module.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TextField from "@/components/TextField";
import MultipleChoice from "@/components/MultipleChoice";
import Dropdown from "@/components/Dropdown";
import HeaderBar from "@/components/HeaderBar";
import PageNumber from "@/components/PageNumber";
import Image from "next/image";
import { type VSR, getVSR, updateVSR, UpdateVSRRequest } from "@/api/VSRs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

export const EditPage = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: vsr.name,
      marital_status: vsr.maritalStatus,
      gender: vsr.gender,
      spouse: vsr.spouseName,
      age: vsr.age,
      ethnicity: vsr.ethnicity[0],
      other_ethnicity: "",
      employment_status: vsr.employmentStatus,
      income_level: vsr.incomeLevel,
      size_of_home: vsr.sizeOfHome,
      num_boys: vsr.agesOfBoys.length,
      num_girls: vsr.agesOfGirls.length,
      ages_of_boys: vsr.agesOfBoys,
      ages_of_girls: vsr.agesOfGirls,
    },
  });
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>(vsr.ethnicity);
  const [otherEthnicity, setOtherEthnicity] = useState("");

  useEffect(() => {
    getVSR(id as string)
      .then((result) => {
        if (result.success) {
          setVSR(result.data);
          setErrorMessage(null);
        } else {
          setErrorMessage("VSR not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, [id]);
  //options

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
  const numBoys = watch("num_boys");
  const numGirls = watch("num_girls");
  //populate form with vsr data

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Construct the request object
    const updateVSRRequest: UpdateVSRRequest = {
      _id: id as string,
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
      const response = await updateVSR(updateVSRRequest);

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
};
