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
} from "@/app/components";
import styles from "src/app/components/Page.module.css";

export interface PageProps {
  // implement later
}

export const Page = (/* implement later*/) => {
  return (
    <div className={styles.page}>
      <HeaderBar />
      <a href="complete">
        <div className={styles.toDashboard}>
          <img width={24} height={24} src="/ic_arrowback.svg" />
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
              <div className={styles.button}>
                <img width={24} height={24} src="/ic_edit.svg" />
                Edit Form
              </div>
            </a>
            <a href="REPLACE">
              <div className={styles.button}>
                <img width={24} height={24} src="/ic_upload.svg" />
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
                <div className={styles.request}>
                  <a href="REPLACE">Request Submission</a>
                </div>
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
