import React, { useEffect, useState } from "react";
import {
  HeaderBar,
  VeteranTag,
  ContactInfo,
  CaseDetails,
  PersonalInformation,
  MilitaryBackground,
  AdditionalInfo,
  RequestedFurnishings,
} from "@/components/VSRIndividual";
import styles from "src/components/VSRIndividual/Page/styles.module.css";
import Image from "next/image";
import { type VSR, getVSR, updateVSRStatus, UpdateVSRRequest, updateVSR } from "@/api/VSRs";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormInput } from "@/app/vsr/page";

export const Page = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formProps = useForm<IFormInput>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = formProps;

  const renderApproveButton = () => (
    <button
      className={styles.approveButton}
      onClick={async () => {
        const res = await updateVSRStatus(vsr._id, "Approved");

        // TODO: error handling

        const newVsr = res.success ? res.data : vsr;

        setVSR(newVsr);
      }}
    >
      Approve VSR
    </button>
  );

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

  const onSubmitEdits: SubmitHandler<IFormInput> = async (data) => {
    const updateVSRRequest: UpdateVSRRequest = {
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
      // ethnicity: selectedEthnicities.concat(otherEthnicity === "" ? [] : [otherEthnicity]),
      employmentStatus: data.employment_status,
      incomeLevel: data.income_level,
      sizeOfHome: data.size_of_home,
    };

    try {
      const response = await updateVSR(updateVSRRequest);
    } catch (error) {}
  };

  return (
    <div className={styles.page}>
      <HeaderBar />
      <a href="/staff/vsr">
        <button className={styles.toDashboard}>
          <Image src="/ic_arrowback.svg" width={24} height={24} alt="arrowback" />
          Dashboard
        </button>
      </a>
      <div className={styles.allDetails}>
        <div className={styles.headerRow}>
          <div className={styles.name}>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <VeteranTag vsr={vsr}></VeteranTag>
          </div>
          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button id="edit" className={styles.button} onClick={() => setIsEditing(true)}>
                  <Image width={24} height={24} src="/ic_edit.svg" alt="edit" />
                  Discard Changes
                </button>
                <a href="REPLACE">
                  <button className={styles.button}>
                    <Image width={24} height={24} src="/ic_upload.svg" alt="upload" />
                    Export
                  </button>
                </a>
              </>
            ) : (
              <>
                <button id="edit" className={styles.button} onClick={() => setIsEditing(true)}>
                  <Image width={24} height={24} src="/ic_edit.svg" alt="edit" />
                  Edit Form
                </button>
                <a href="REPLACE">
                  <button className={styles.button}>
                    <Image width={24} height={24} src="/ic_upload.svg" alt="upload" />
                    Export
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
        <div className={styles.bodyDetails}>
          <CaseDetails vsr={vsr} onUpdateVSR={setVSR}></CaseDetails>
          <div className={styles.otherDetails}>
            <div className={styles.personalInfo}>
              <ContactInfo vsr={vsr} isEditing={isEditing} formProps={formProps} />
              <PersonalInformation vsr={vsr} />
              <MilitaryBackground vsr={vsr} />
              <AdditionalInfo vsr={vsr} />
            </div>
            <div className={styles.rightColumn}>
              <RequestedFurnishings vsr={vsr} />
              <div className={styles.finalActions}>
                {vsr.status == "Received" || vsr.status === undefined
                  ? renderApproveButton()
                  : null}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
};
