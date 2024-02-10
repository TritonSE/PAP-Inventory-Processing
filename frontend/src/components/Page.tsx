import React from "react";
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

export interface PageProps {
  // implement later
}

export const Page = (/* implement later*/) => {
  return (
    <div className={styles.page}>
      <HeaderBar />
      <a href="complete">
        <div className={styles.toDashboard}>
          <Image src="/ic_arrowback.svg" width={24} height={24} alt="arrowback" />
          Dashboard
        </div>
      </a>
      <div className={styles.allDetails}>
        <div className={styles.headerRow}>
          <div className={styles.name}>
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
          <CaseDetails></CaseDetails>
          <div className={styles.otherDetails}>
            <div className={styles.personalInfo}>
              <ContactInfo />
              <PersonalInformation />
              <MilitaryBackground />
              <AdditionalInfo />
            </div>
            <div>
              <div className={styles.furnishings}>
                <RequestedFurnishings />
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
