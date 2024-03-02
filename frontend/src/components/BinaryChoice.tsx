import Chip from "@mui/material/Chip";
import styles from "@/components/MultipleChoice.module.css";

// options are always Yes or No
export interface BinaryChoiceProps {
  label: string;
  value: boolean;
  onChange: (selected: boolean) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

const BinaryChoice = ({ label, value, onChange, required, helperText }: BinaryChoiceProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p>
        {required ? <span className={styles.requiredAsterisk}>* </span> : null}
        {label}
      </p>
      <div className={styles.chipContainer}>
        {[true, false].map((option) => {
          const optionIsSelected = option === value;

          return (
            <Chip
              label={option ? "Yes" : "No"}
              key={option ? "Yes" : "No"}
              onClick={() => {
                if (optionIsSelected) {
                  // option is already selected -> set value to false
                  onChange(false);
                } else {
                  // option not previously selected -> set value to true
                  onChange(true);
                }
              }}
              className={`${styles.chip} ${
                optionIsSelected ? styles.chipSelected : styles.chipUnselected
              }`}
              clickable
            />
          );
        })}
      </div>
      {helperText ? <div className={styles.helperText}>{helperText}</div> : null}
    </div>
  );
};

export default BinaryChoice;
