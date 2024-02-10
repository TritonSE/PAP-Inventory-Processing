import React, { useEffect, useState } from "react";
import {
  HeaderBar,
  UserTag,
  ContactInfo,
  CaseDetails,
  PersonalInformation,
  MilitaryBackground,
  AdditionalInfo,
  RequestedFurnishings,
} from "@/components";
import styles from "src/components/Page.module.css";
import Image from "next/image";
import { type VSR, getVSR } from "@/api/VSRs";
import { useParams } from "next/navigation";

export const Page = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  return (
    <div className={styles.page}>
      <HeaderBar />
      <a href="/staff/vsr">
        <div className={styles.toDashboard}>
          <Image src="/ic_arrowback.svg" width={24} height={24} alt="arrowback" />
          Dashboard
        </div>
      </a>
      <div className={styles.allDetails}>
        <div className={styles.headerRow}>
          <div className={styles.name}>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <UserTag></UserTag>
          </div>
          <div className={styles.actions}>
            <a href="REPLACE">
              <div id="edit" className={styles.button}>
                <Image width={24} height={24} src="/ic_edit.svg" alt="edit" />
                Edit Form
              </div>
            </a>
            <a href="REPLACE">
              <div className={styles.button}>
                <Image width={24} height={24} src="/ic_upload.svg" alt="upload" />
                Export
              </div>
            </a>
          </div>
        </div>
        <div className={styles.formDetails}>
          <CaseDetails vsr={vsr}></CaseDetails>
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
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
};
function setErrorMessage(arg0: string) {
  throw new Error("Function not implemented.");
}
