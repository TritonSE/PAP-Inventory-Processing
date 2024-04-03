import { useState } from "react";
import styles from "@/components/shared/input/BinaryChoice/styles.module.css";
import { FormField } from "@/components/shared/input/FormField";
import { StyledChip } from "../StyledChip";

export interface BinaryChoiceProps {
  label: string;
  value: boolean | null;
  onChange: (selected: boolean | null) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

/**
 * An input component that allows the user to select either "Yes" or "No" by clicking on chips.
 */
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
        <StyledChip
          text="Yes"
          selected={selectedOption === true}
          onClick={() => handleOptionClick(true)}
        />
        <StyledChip
          text="No"
          selected={selectedOption === false}
          onClick={() => handleOptionClick(false)}
        />
      </div>
    </FormField>
  );
};

export default BinaryChoice;
