import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import styles from "@/components/MultipleChoice.module.css";

export interface MultipleChoiceProps {
  label: string;
  options: string[];
  value: string;
  onChange: (selected: string) => void;
  error?: boolean;
  helperText?: string;
}

const MultipleChoice = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  ...props
}: MultipleChoiceProps) => {
  return (
    <div>
      <p className={styles.label}>{label}</p>
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
  );
};

export default MultipleChoice;
