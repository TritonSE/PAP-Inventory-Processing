import { useState } from "react";
import Chip from "@mui/material/Chip";
import styles from "@/components/shared/input/BinaryChoice/styles.module.css";
import { FormField } from "../FormField";

export interface BinaryChoiceProps {
  label: string;
  value: boolean | null;
  onChange: (selected: boolean | null) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

const BinaryChoice = ({
  label,
  value,
  onChange,
  required,
  error,
  helperText,
}: BinaryChoiceProps) => {
  const [selectedOption, setSelectedOption] = useState<boolean | null>(value);

  const handleOptionClick = (newOption: boolean | null) => {
    setSelectedOption(newOption);
    onChange(newOption);
  };

  return (
    <FormField label={label} required={required} error={error} helperText={helperText}>
      <div className={styles.chipContainer}>
        <Chip
          label="Yes"
          onClick={() => handleOptionClick(true)}
          className={`${styles.chip} ${
            selectedOption === true ? styles.chipSelected : styles.chipUnselected
          }`}
          clickable
        />
        <Chip
          label="No"
          onClick={() => handleOptionClick(false)}
          className={`${styles.chip} ${
            selectedOption === false ? styles.chipSelected : styles.chipUnselected
          }`}
          clickable
        />
      </div>
    </FormField>
  );
};

export default BinaryChoice;
