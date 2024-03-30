import Chip from "@mui/material/Chip";
import styles from "@/components/shared/input/MultipleChoice/styles.module.css";
import { FormField } from "../FormField";

export interface MultipleChoiceProps {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (selected: string | string[]) => void;
  required: boolean;
  allowMultiple?: boolean;
  error?: boolean;
  helperText?: string;
}

const MultipleChoice = ({
  label,
  options,
  value,
  onChange,
  required,
  allowMultiple = false,
  error,
  helperText,
}: MultipleChoiceProps) => {
  return (
    <FormField label={label} required={required} error={error} helperText={helperText}>
      <div className={styles.chipContainer}>
        {options.map((option) => {
          const optionIsSelected = allowMultiple ? value?.includes(option) : value === option;

          return (
            <Chip
              label={option}
              key={option}
              onClick={() => {
                if (allowMultiple) {
                  if (optionIsSelected) {
                    // Allow multiple + already selected -> remove option from selected
                    onChange(((value as string[]) ?? []).filter((_value) => _value !== option));
                  } else {
                    // Allow multiple + not already selected -> add option to selected
                    onChange(((value as string[]) ?? []).concat([option]));
                  }
                } else {
                  if (optionIsSelected) {
                    // Disallow multiple + already selected -> set value to nothing selected
                    onChange("");
                  } else {
                    // Disallow multiple + not already selected -> set value to option
                    onChange(option);
                  }
                }
              }}
              className={`${styles.chip} ${
                optionIsSelected ? styles.chipSelected : styles.chipUnselected
              }`}
              clickable
              sx={{
                ".MuiChip-label": {
                  padding: "0 !important",
                },
              }}
            />
          );
        })}
      </div>
    </FormField>
  );
};

export default MultipleChoice;
