import React from "react";
import {
  HeaderBar,
  UserTag,
  ContactInfo,
  CaseDetails,
  PersonalInformation,
  MilitaryBackground,
  AdditionalFiles,
  RequestedFurnishings,
} from "@/app/components";
import styles from "src/app/components/Page.module.css";

export interface PageProps {
  // implement later
}

export const Page = (/* implement later*/) => {
  return (
    <div className={styles.page}>
      <div className={styles.toDashboard}>
        <img width={14} height={12} src="/backarrow.svg" />
        <a href="complete">Back To Dashboard</a>
      </div>
      <HeaderBar />
      <div className={styles.allDetails}>
        <UserTag></UserTag>
        <CaseDetails></CaseDetails>
        <div className={styles.otherDetails}>
          <div className={styles.personalInfo}>
            <ContactInfo />
            <PersonalInformation />
            <MilitaryBackground />
            <AdditionalFiles />
          </div>
          <div className={styles.furnishings}>
            <RequestedFurnishings />
          </div>
        </div>
      </div>
    </div>
  );
};
