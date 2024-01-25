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
      <div className={styles.toDashboard}>
        <img width={24} height={24} src="/ic_arrowback.svg" />
        <a href="complete">Dashboard</a>
      </div>
      <div className={styles.allDetails}>
        <div className={styles.name}>
          <UserTag></UserTag>
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
            <div className={styles.furnishings}>
              <RequestedFurnishings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
