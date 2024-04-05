import styles from "@/components/shared/input/ChildrenInput/styles.module.css";
import { UseFormReturn } from "react-hook-form";
import TextField from "@/components/shared/input/TextField";
import { IFormInput } from "@/app/vsr/page";
import { useScreenSizes } from "@/hooks/useScreenSizes";

interface ChildrenInputProps {
  gender: "boy" | "girl";
  formProps: UseFormReturn<IFormInput>;
}

/**
 * A component that renders the text fields to input the children of the given gender.
 */
export const ChildrenInput = ({ gender, formProps }: ChildrenInputProps) => {
  const numChildrenThisGender = formProps.watch()[`num_${gender}s`];
  const fieldInputName = `agesOf${gender[0].toUpperCase()}${gender.substring(1)}s` as
    | "agesOfBoys"
    | "agesOfGirls";

  const { isMobile } = useScreenSizes();

  return (
    <>
      <div className={styles.textInputWrapper}>
        <TextField
          label={`Number of ${gender === "boy" ? "Male" : "Female"} Children`}
          variant="outlined"
          placeholder="e.g. 2"
          type="number"
          {...formProps.register(`num_${gender}s`, {
            required: `Number of ${gender}s is required`,
            pattern: {
              // Only allow up to 2 digits
              value: /^[0-9][0-9]?$/,
              message: "This field must be a positive number less than 100",
            },
          })}
          required
          error={!!formProps.formState.errors[`num_${gender}s`]}
          helperText={formProps.formState.errors[`num_${gender}s`]?.message}
        />
      </div>

      {numChildrenThisGender > 0 || !isMobile ? (
        <div className={styles.numChildren}>
          {/* Cap it at 99 children per gender to avoid freezing web browser */}
          {Array.from({ length: Math.min(numChildrenThisGender, 99) }, (_, index) => (
            <div key={index} className={styles.childInputWrapper}>
              <TextField
                label={`Age of ${gender.substring(0, 1).toUpperCase()}${gender.substring(1)}`}
                type="number"
                variant="outlined"
                {...formProps.register(`${fieldInputName}.${index}`, {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "This field must be a positive number",
                  },
                  max: {
                    value: 17,
                    message: "Only enter children under 18",
                  },
                })}
                error={!!formProps.formState.errors[fieldInputName]?.[index]}
                helperText={formProps.formState.errors[fieldInputName]?.[index]?.message}
                required
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};
