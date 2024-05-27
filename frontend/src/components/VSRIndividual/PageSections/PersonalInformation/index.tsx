import React, { useEffect } from "react";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { UseFormReturn } from "react-hook-form";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { TextInputDetail } from "@/components/VSRIndividual/FieldDetails/TextInputDetail";
import { SelectInputDetail } from "@/components/VSRIndividual/FieldDetails/SelectInputDetail";
import {
  employmentOptions,
  ethnicityOptions,
  genderOptions,
  homeOptions,
  incomeOptions,
  maritalOptions,
} from "@/constants/fieldOptions";
import { MultipleChoiceInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceInputDetail";
import { MultipleChoiceWithOtherInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceWithOtherInputDetail";
import { ChildrenInput } from "@/components/shared/input/ChildrenInput";
import styles from "@/components/VSRIndividual/PageSections/PersonalInformation/styles.module.css";

export interface PersonalInformationProps {
  vsr: VSR;
  isEditing: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 * The "Personal Information" section of the VSR individual page.
 */
export const PersonalInformation = ({ vsr, isEditing, formProps }: PersonalInformationProps) => {
  useEffect(() => {
    formProps.setValue("name", vsr.name);
    formProps.setValue("gender", vsr.gender);
    formProps.setValue("age", vsr.age);
    formProps.setValue("maritalStatus", vsr.maritalStatus);
    formProps.setValue("spouseName", vsr.spouseName ?? "");
    formProps.setValue("num_boys", vsr.agesOfBoys.length);
    formProps.setValue("num_girls", vsr.agesOfGirls.length);
    formProps.setValue("agesOfBoys", vsr.agesOfBoys);
    formProps.setValue("agesOfGirls", vsr.agesOfGirls);
    formProps.setValue("other_ethnicity", "");
    const ethnicityChips = [];
    for (const inputtedEthnicity of vsr.ethnicity) {
      if (ethnicityOptions.includes(inputtedEthnicity)) {
        ethnicityChips.push(inputtedEthnicity);
      } else {
        formProps.setValue("other_ethnicity", inputtedEthnicity);
      }
    }
    formProps.setValue("ethnicity", ethnicityChips);
    formProps.setValue("form_ethnicity", vsr.ethnicity.length > 0 ? "full" : "");
    formProps.setValue("employment_status", vsr.employmentStatus);
    formProps.setValue("income_level", vsr.incomeLevel);
    formProps.setValue("size_of_home", vsr.sizeOfHome);
  }, [vsr]);

  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Personal Information">
      <div className={styles.row}>
        {isEditing ? (
          <TextInputDetail
            name="name"
            title="Name"
            formProps={formProps}
            placeholder="e.g. Justin Timberlake"
          />
        ) : (
          <SingleDetail title="Name" value={vsr.name} />
        )}
      </div>

      <div className={styles.row}>
        {isEditing ? (
          <SelectInputDetail
            name="gender"
            title="Gender"
            formProps={formProps}
            options={genderOptions}
          />
        ) : (
          <SingleDetail title="Gender" value={vsr.gender} />
        )}
        {isEditing ? (
          <TextInputDetail
            name="age"
            title="Age"
            formProps={formProps}
            placeholder="Enter your age"
          />
        ) : (
          <SingleDetail title="Age" value={vsr.age} />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceInputDetail
            name="maritalStatus"
            title="Marital Status"
            formProps={formProps}
            options={maritalOptions}
            allowMultiple={false}
          />
        ) : (
          <ListDetail title="Marital Status" values={[vsr.maritalStatus]} isEmpty={false} />
        )}
      </div>
      {formProps.watch().maritalStatus === "Married" ? (
        <div className={styles.row}>
          {isEditing ? (
            <TextInputDetail
              name="spouseName"
              title="Spouse's Name"
              formProps={formProps}
              placeholder="e.g. Jane Timberlake"
            />
          ) : (
            <SingleDetail
              title="Spouse's Name"
              value={vsr.spouseName && vsr.spouseName.length > 0 ? vsr.spouseName : "No spouse"}
            />
          )}
        </div>
      ) : null}
      <div className={styles.row}>
        {isEditing ? (
          <>
            <ChildrenInput gender="boy" showAsterisks={false} formProps={formProps} />
          </>
        ) : (
          <>
            <SingleDetail title="Number of Male Children" value={vsr.agesOfBoys?.length ?? 0} />
            <SingleDetail
              title="Age(s)"
              value={
                vsr.agesOfBoys && vsr.agesOfBoys.length > 0
                  ? vsr.agesOfBoys.join(", ")
                  : "No male children"
              }
              isEmpty={!(vsr.agesOfBoys && vsr.agesOfBoys.length > 0)}
            />
          </>
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <>
            <ChildrenInput gender="girl" showAsterisks={false} formProps={formProps} />
          </>
        ) : (
          <>
            <SingleDetail title="Number of Female Children" value={vsr.agesOfGirls?.length ?? 0} />
            <SingleDetail
              title="Age(s)"
              value={
                vsr.agesOfGirls && vsr.agesOfGirls.length > 0
                  ? vsr.agesOfGirls.join(", ")
                  : "No female children"
              }
              isEmpty={!(vsr.agesOfGirls && vsr.agesOfGirls.length > 0)}
            />
          </>
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceWithOtherInputDetail
            title="Ethnicity"
            name="ethnicity"
            otherName="other_ethnicity"
            formName="form_ethnicity"
            options={ethnicityOptions}
            allowMultiple
            formProps={formProps}
          />
        ) : (
          <ListDetail
            title="Ethnicity"
            values={
              vsr.ethnicity && vsr.ethnicity.length > 0 ? vsr.ethnicity : ["No items selected"]
            }
            isEmpty={!(vsr.ethnicity && vsr.ethnicity.length > 0)}
          />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceInputDetail
            name="employment_status"
            title="Employment Status"
            formProps={formProps}
            options={employmentOptions}
            allowMultiple={false}
          />
        ) : (
          <ListDetail title="Employment Status" values={[vsr.employmentStatus]} isEmpty={false} />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceInputDetail
            name="income_level"
            title="Income Level"
            formProps={formProps}
            options={incomeOptions}
            allowMultiple={false}
          />
        ) : (
          <ListDetail title="Income Level" values={[vsr.incomeLevel]} isEmpty={false} />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceInputDetail
            name="size_of_home"
            title="Size of Home"
            formProps={formProps}
            options={homeOptions}
            allowMultiple={false}
          />
        ) : (
          <ListDetail title="Size of Home" values={[vsr.sizeOfHome]} isEmpty={false} />
        )}
      </div>
    </VSRIndividualAccordion>
  );
};
