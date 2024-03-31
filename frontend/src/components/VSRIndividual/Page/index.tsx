import React, { useEffect, useState } from "react";
import {
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
import { useScreenSizes } from "@/hooks/useScreenSizes";
import HeaderBar from "@/components/shared/HeaderBar";

export const Page = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();

  const { isMobile, isTablet } = useScreenSizes();
  const iconSize = isMobile ? 16 : isTablet ? 19 : 24;

  const renderApproveButton = () =>
    vsr.status == "Received" || vsr.status === undefined ? (
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
    ) : null;

  const renderActions = () => (
    <div className={styles.actions}>
      <a href="REPLACE">
        <button id="edit" className={styles.button}>
          <Image width={iconSize} height={iconSize} src="/ic_edit.svg" alt="edit" />
          {isMobile ? null : "Edit Form"}
        </button>
      </a>
      <a href="REPLACE">
        <button className={styles.button}>
          <Image width={iconSize} height={iconSize} src="/ic_upload.svg" alt="upload" />
          {isMobile ? null : "Export"}
        </button>
      </a>
    </div>
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
    <>
      <HeaderBar showLogoutButton />
      <div className={styles.page}>
        <div className={`${styles.headerRow} ${styles.toDashboardRow}`}>
          <a href="/staff/vsr">
            <button className={styles.toDashboard}>
              <Image src="/ic_arrowback.svg" width={iconSize} height={iconSize} alt="arrowback" />
              {isMobile ? null : "Dashboard"}
            </button>
          </a>
          {isMobile ? renderActions() : null}
        </div>
        <div className={styles.allDetails}>
          <div className={styles.headerRow}>
            <div className={styles.name}>
              {errorMessage && <div className={styles.error}>{errorMessage}</div>}

              <VeteranTag vsr={vsr}></VeteranTag>
            </div>
            {isMobile ? null : renderActions()}
          </div>
          <div className={styles.bodyDetails}>
            <CaseDetails vsr={vsr} onUpdateVSR={setVSR}></CaseDetails>
            <div className={styles.otherDetails}>
              {isTablet ? renderApproveButton() : null}
              <div className={styles.personalInfo}>
                <ContactInfo vsr={vsr} />
                <PersonalInformation vsr={vsr} />
                <MilitaryBackground vsr={vsr} />
                <AdditionalInfo vsr={vsr} />
              </div>
              <div className={styles.rightColumn}>
                <RequestedFurnishings vsr={vsr} furnitureItems={furnitureItems ?? []} />
                {isTablet ? null : (
                  <div className={styles.finalActions}>{renderApproveButton()}</div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.footer}></div>
        </div>
      </div>
    </>
  );
};
