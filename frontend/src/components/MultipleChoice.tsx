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
        {required ? <span className={styles.requiredAsterisk}>* </span> : null}
        {label}
      </p>
      <div className={styles.chipContainer}>
        {options.map((option) => (
          <Chip
            label={option}
            key={option}
            onClick={() => {
              if (value === option) {
                onChange("");
              } else {
                onChange(option);
              }
            }}
            className={`${styles.chip} ${
              value === option ? styles.chipSelected : styles.chipUnselected
            }`}
            clickable
          />
        ))}
      </div>
      {helperText ? <div className={styles.helperText}>{helperText}</div> : null}
    </div>
  );
};

export default MultipleChoice;
