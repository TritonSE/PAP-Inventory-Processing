import React, { useEffect } from "react";
import styles from "@/components/VSRIndividual/PageSections/PersonalInformation/styles.module.css";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { UseFormReturn } from "react-hook-form";
import { IFormInput } from "@/app/vsr/page";
import { TextInputDetail } from "@/components/VSRIndividual/FieldDetails/TextInputDetail";
import { SelectInputDetail } from "@/components/VSRIndividual/FieldDetails/SelectInputDetail";
import {
  employmentOptions,
  ethnicityOptions,
  homeOptions,
  incomeOptions,
  maritalOptions,
  stateOptions,
} from "@/constants/fieldOptions";
import { MultipleChoiceInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceInputDetail";
import { MultipleChoiceWithOtherInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceWithOtherInputDetail";
import { ChildrenInput } from "@/components/shared/input/ChildrenInput";

export interface PersonalInformationProps {
  vsr: VSR;
  isEditing: boolean;
  formProps: UseFormReturn<IFormInput>;
}

/**
 * The "Personal Information" section of the VSR individual page.
 */
export const PersonalInformation = ({ vsr, isEditing, formProps }: PersonalInformationProps) => {
  useEffect(() => {
    formProps.setValue("name", vsr.name);
    formProps.setValue("streetAddress", vsr.streetAddress);
    formProps.setValue("city", vsr.city);
    formProps.setValue("zipCode", vsr.zipCode);
    formProps.setValue("state", vsr.state);
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
      {isEditing ? (
        <>
          <div className={styles.row}>
            <TextInputDetail
              name="streetAddress"
              title="Street Address"
              formProps={formProps}
              placeholder="e.g. 1234 Baker Street"
            />
          </div>
          <div className={styles.row}>
            <TextInputDetail
              name="city"
              title="City"
              formProps={formProps}
              placeholder="e.g. San Diego"
            />
          </div>
        </>
      ) : (
        <div className={styles.row}>
          <SingleDetail title="Street Address" value={vsr.streetAddress} />
          <SingleDetail title="City" value={vsr.city} />
        </div>
      )}
      <div className={styles.row}>
        {isEditing ? (
          <SelectInputDetail
            name="state"
            title="State"
            formProps={formProps}
            options={stateOptions}
          />
        ) : (
          <SingleDetail title="State" value={vsr.state} />
        )}
        {isEditing ? (
          <TextInputDetail
            name="zipCode"
            title="Zip Code"
            formProps={formProps}
            placeholder="e.g. 92092"
          />
        ) : (
          <SingleDetail title="Zip Code" value={vsr.zipCode} />
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
          <ListDetail title="Marital Status" values={[vsr.maritalStatus]} />
        )}
      </div>
      {vsr.maritalStatus === "Married" ? (
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
              value={vsr.spouseName && vsr.spouseName.length > 0 ? vsr.spouseName : "N/A"}
            />
          )}
        </div>
      ) : null}
      <div className={styles.row}>
        {isEditing ? (
          <>
            <ChildrenInput gender="boy" formProps={formProps} />
          </>
        ) : (
          <>
            <SingleDetail title="Number of Male Children" value={vsr.agesOfBoys?.length ?? 0} />
            <SingleDetail
              title="Age(s)"
              value={
                vsr.agesOfBoys && vsr.agesOfBoys.length > 0 ? vsr.agesOfBoys.join(", ") : "N/A"
              }
            />
          </>
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <>
            <ChildrenInput gender="girl" formProps={formProps} />
          </>
        ) : (
          <>
            <SingleDetail title="Number of Female Children" value={vsr.agesOfGirls?.length ?? 0} />
            <SingleDetail
              title="Age(s)"
              value={
                vsr.agesOfGirls && vsr.agesOfGirls.length > 0 ? vsr.agesOfGirls.join(", ") : "N/A"
              }
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
            options={ethnicityOptions}
            allowMultiple
            formProps={formProps}
          />
        ) : (
          <ListDetail
            title="Ethnicity"
            values={vsr.ethnicity && vsr.ethnicity.length > 0 ? vsr.ethnicity : ["N/A"]}
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
          <ListDetail title="Employment Status" values={[vsr.employmentStatus]} />
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
          <ListDetail title="Income Level" values={[vsr.incomeLevel]} />
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
          <ListDetail title="Size of Home" values={[vsr.sizeOfHome]} />
        )}
      </div>
    </VSRIndividualAccordion>
  );
};
