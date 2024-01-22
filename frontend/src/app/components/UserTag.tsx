import React from "react";
import styles from "src/app/components/UserTag.module.css";

export interface UserTagProps {
  // fill in after user data stuff implemented
}

export function UserTag(/*{user}: UserTagProps*/) {
  return (
    <div className={styles.items}>
      <span> Justin Timberlake </span>
    </div>
  );
}
