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
import { type VSR, getVSR, updateVSRStatus } from "@/api/VSRs";
import { useParams } from "next/navigation";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";

export const Page = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();

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

  // Fetch all available furniture items from database
  useEffect(() => {
    getFurnitureItems()
      .then((result) => {
        if (result.success) {
          setFurnitureItems(result.data);

          setErrorMessage(null);
        } else {
          setErrorMessage("Furniture items not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, []);

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
            <a href="REPLACE">
              <button id="edit" className={styles.button}>
                <Image width={24} height={24} src="/ic_edit.svg" alt="edit" />
                Edit Form
              </button>
            </a>
            <a href="REPLACE">
              <button className={styles.button}>
                <Image width={24} height={24} src="/ic_upload.svg" alt="upload" />
                Export
              </button>
            </a>
          </div>
        </div>
        <div className={styles.bodyDetails}>
          <CaseDetails vsr={vsr} onUpdateVSR={setVSR}></CaseDetails>
          <div className={styles.otherDetails}>
            <div className={styles.personalInfo}>
              <ContactInfo vsr={vsr} />
              <PersonalInformation vsr={vsr} />
              <MilitaryBackground vsr={vsr} />
              <AdditionalInfo vsr={vsr} />
            </div>
            <div className={styles.rightColumn}>
              <RequestedFurnishings vsr={vsr} furnitureItems={furnitureItems ?? []} />
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
