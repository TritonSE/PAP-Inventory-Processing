import React, { ChangeEvent } from "react";
import styles from "@/components/shared/input/InputField/styles.module.css";

interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A text input field component, used on the login screen.
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div className={styles.inputField}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
};

export default InputField;
