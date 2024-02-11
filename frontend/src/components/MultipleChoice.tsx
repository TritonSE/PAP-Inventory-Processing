import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import styles from "@/components/MultipleChoice.module.css";

export interface MultipleChoiceProps {
  label: string;
  options: string[];
  value: string;
  onChange: (selected: string) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

const MultipleChoice = ({
  label,
  options,
  value,
  onChange,
  required,
  helperText,
}: MultipleChoiceProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p>
        {required && <span className={styles.requiredAsterisk}>* </span>}
        {label}
      </p>
      <div className={styles.chipContainer}>
        {options.map((option) => (
          <Chip
            label={option}
            key={option}
            onClick={() => onChange(option)}
            className={`${styles.chip} ${
              value === option ? styles.chipSelected : styles.chipUnselected
            }`}
            clickable
          />
        ))}
      </div>
      <div className={styles.helperText}>{helperText}</div>
    </div>
  );
};

export default MultipleChoice;
