import { useState } from 'react';
import Chip from "@mui/material/Chip";
import styles from "@/components/MultipleChoice.module.css";

export interface BinaryChoiceProps {
  label: string;
  value: boolean;
  onChange: (selected: boolean) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

const BinaryChoice = ({ label, value, onChange, required, helperText }: BinaryChoiceProps) => {
  const [selectedOption, setSelectedOption] = useState(value);

  const handleOptionClick = (newOption: boolean) => {
    console.log('Current value:', newOption);
    setSelectedOption(newOption);
    onChange(newOption);
  };

  return (
    <div className={styles.wrapperClass}>
      <p>
        {required ? <span className={styles.requiredAsterisk}>* </span> : null}
        {label}
      </p>
      <div className={styles.chipContainer}>
        <Chip
          label="Yes"
          onClick={() => handleOptionClick(true)}
          className={`${styles.chip} ${selectedOption ? styles.chipSelected : styles.chipUnselected}`}
          clickable
        />
        <Chip
          label="No"
          onClick={() => handleOptionClick(false)}
          className={`${styles.chip} ${!selectedOption ? styles.chipSelected : styles.chipUnselected}`}
          clickable
        />
      </div>
      {helperText ? <div className={styles.helperText}>{helperText}</div> : null}
    </div>
  );
};

export default BinaryChoice;
