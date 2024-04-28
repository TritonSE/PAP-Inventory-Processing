import React, { useEffect } from "react";
import styles from "@/components/VSRIndividual/PageSections/AdditionalInfo/styles.module.css";
import { ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { BinaryChoiceInputDetail } from "@/components/VSRIndividual/FieldDetails/BinaryChoiceInputDetail";
import { UseFormReturn } from "react-hook-form";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { MultipleChoiceWithOtherInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceWithOtherInputDetail";
import { hearFromOptions } from "@/constants/fieldOptions";

export interface AdditionalInfoProps {
  vsr: VSR;
  isEditing: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 * The "Additional Information" section of the VSR individual page.
 */
export const AdditionalInfo = ({ vsr, isEditing, formProps }: AdditionalInfoProps) => {
  useEffect(() => {
    formProps.setValue("petCompanion", vsr.petCompanion);
    const isHearFromChip = hearFromOptions.includes(vsr.hearFrom);
    formProps.setValue("hearFrom", isHearFromChip ? vsr.hearFrom : "");
    formProps.setValue("other_hearFrom", isHearFromChip ? "" : vsr.hearFrom);
    formProps.setValue("form_hearFrom", vsr.hearFrom.length > 0 ? "full" : "");
  }, [vsr]);

  return (
    <VSRIndividualAccordion title="Additional Information" permanentlyExpanded={false}>
      <div className={styles.row}>
        {isEditing ? (
          <BinaryChoiceInputDetail
            name="petCompanion"
            title="Are you interested in a companionship animal (pet)?"
            formProps={formProps}
          />
        ) : (
          <ListDetail
            title="Are you interested in a companionship animal (pet)?"
            values={[vsr.petCompanion ? "Yes" : "No"]}
            isEmpty={false}
          />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceWithOtherInputDetail
            name="hearFrom"
            otherName="other_hearFrom"
            formName="form_hearFrom"
            title="How did you hear about us?"
            formProps={formProps}
            options={hearFromOptions}
            allowMultiple={false}
          />
        ) : (
          <ListDetail title="How did you hear about us?" values={[vsr.hearFrom]} isEmpty={false} />
        )}
      </div>
    </VSRIndividualAccordion>
  );
};
