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
import styles from "src/components/VSRIndividual/Page/Page.module.css";
import Image from "next/image";
import { getVSR, type VSR } from "@/api/VSRs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import EditPage from "@/components/EditVSR";

export const Page = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  function nextPath(path: string) {
    useRouter().push(path);
  }

  useEffect(() => {
    getVSR(id as string)
      .then((result) => {
        if (result.success) {
          setVSR(result.data);
          setErrorMessage(null);
        } else {
          setErrorMessage("VSR not found." as string);
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
    nextPath(`/staff/vsr/${id}/edit`);
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
            {!isEditing && (
              <button id="edit" className={styles.button} onClick={handleEditClick}>
                <Image width={24} height={24} src="/ic_edit.svg" alt="edit" />
                Edit Form
              </button>
            )}
            <a href="edit_form">
              <button className={styles.button}>
                <Image width={24} height={24} src="/ic_upload.svg" alt="upload" />
                Export
              </button>
            </a>
          </div>
        </div>
        <div className={styles.formDetails}>
          {isEditing ? (
            <EditPage vsr={vsr} onUpdateVSR={setVSR} />
          ) : (
            <>
              <CaseDetails vsr={vsr} onUpdateVSR={setVSR}></CaseDetails>
              <div className={styles.otherDetails}>
                <div className={styles.personalInfo}>
                  <ContactInfo vsr={vsr} />
                  <PersonalInformation vsr={vsr} />
                  <MilitaryBackground vsr={vsr} />
                  <AdditionalInfo vsr={vsr} />
                </div>
                <div>
                  <div className={styles.furnishings}>
                    <RequestedFurnishings vsr={vsr} />
                  </div>
                  <div className={styles.finalActions}>
                    <div className={styles.approve}>
                      <a href="REPLACE">Approve VSR</a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
};
