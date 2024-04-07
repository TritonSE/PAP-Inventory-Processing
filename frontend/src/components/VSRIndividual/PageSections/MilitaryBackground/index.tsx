import React, { useEffect } from "react";
import styles from "@/components/VSRIndividual/PageSections/MilitaryBackground/styles.module.css";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { UseFormReturn } from "react-hook-form";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { branchOptions, conflictsOptions, dischargeStatusOptions } from "@/constants/fieldOptions";
import { MultipleChoiceInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceInputDetail";
import { MultipleChoiceWithOtherInputDetail } from "@/components/VSRIndividual/FieldDetails/MultipleChoiceWithOtherInputDetail";
import { BinaryChoiceInputDetail } from "@/components/VSRIndividual/FieldDetails/BinaryChoiceInputDetail";
import { TextInputDetail } from "@/components/VSRIndividual/FieldDetails/TextInputDetail";

export interface MilitaryBackgroundProps {
  vsr: VSR;
  isEditing: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 * The "Military Background" section of the VSR individual page.
 */
export const MilitaryBackground = ({ vsr, isEditing, formProps }: MilitaryBackgroundProps) => {
  useEffect(() => {
    formProps.setValue("branch", vsr.branch);
    const conflictChips = [];
    formProps.setValue("other_conflicts", "");
    for (const inputtedConflict of vsr.conflicts) {
      if (conflictsOptions.includes(inputtedConflict)) {
        conflictChips.push(inputtedConflict);
      } else {
        formProps.setValue("other_conflicts", inputtedConflict);
      }
    }
    formProps.setValue("conflicts", conflictChips);
    formProps.setValue("dischargeStatus", vsr.dischargeStatus);
    formProps.setValue("serviceConnected", vsr.serviceConnected);
    formProps.setValue("lastRank", vsr.lastRank);
    formProps.setValue("militaryID", vsr.militaryID);
  }, [vsr]);

  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Military Background">
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceInputDetail
            name="branch"
            title="Branch"
            formProps={formProps}
            options={branchOptions}
            allowMultiple
          />
        ) : (
          <ListDetail
            title="Branch"
            values={vsr.branch && vsr.branch.length > 0 ? vsr.branch : ["N/A"]}
          />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceWithOtherInputDetail
            name="conflicts"
            otherName="other_conflicts"
            title="Conflicts"
            formProps={formProps}
            options={conflictsOptions}
            allowMultiple
          />
        ) : (
          <ListDetail
            title="Conflicts"
            values={vsr.conflicts && vsr.conflicts.length > 0 ? vsr.conflicts : ["N/A"]}
          />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <MultipleChoiceInputDetail
            name="dischargeStatus"
            title="Discharge Status"
            formProps={formProps}
            options={dischargeStatusOptions}
            allowMultiple={false}
          />
        ) : (
          <ListDetail
            title="Discharge Status"
            values={
              vsr.dischargeStatus && vsr.dischargeStatus.length > 0
                ? [vsr.dischargeStatus]
                : ["N/A"]
            }
          />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <BinaryChoiceInputDetail
            name="serviceConnected"
            title="Service Connected"
            formProps={formProps}
          />
        ) : (
          <ListDetail title="Service Connected" values={[vsr.serviceConnected ? "Yes" : "No"]} />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <TextInputDetail
            name="lastRank"
            title="Last Rank:"
            formProps={formProps}
            placeholder="Enter"
          />
        ) : (
          <SingleDetail title="Last Rank:" value={vsr.lastRank} />
        )}
        {isEditing ? (
          <TextInputDetail
            name="militaryID"
            title="Military ID Number"
            formProps={formProps}
            placeholder="Enter"
          />
        ) : (
          <SingleDetail title="Military ID Number" value={vsr.militaryID} />
        )}
      </div>
    </VSRIndividualAccordion>
  );
};
