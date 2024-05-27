import { UseFormReturn } from "react-hook-form";
import TextField from "@/components/shared/input/TextField";
import { ICreateVSRFormInput, IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import styles from "@/components/shared/input/ChildrenInput/styles.module.css";

interface ChildrenInputProps {
  gender: "boy" | "girl";
  showAsterisks: boolean;
  formProps: UseFormReturn<ICreateVSRFormInput> | UseFormReturn<IEditVSRFormInput>;
}

/**
 * A component that renders the text fields to input the children of the given gender.
 */
export const ChildrenInput = ({ gender, showAsterisks, formProps }: ChildrenInputProps) => {
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
          {...(formProps as UseFormReturn<ICreateVSRFormInput>).register(`num_${gender}s`, {
            required: `Number of ${gender}s is required`,
            pattern: {
              // Only allow up to 2 digits
              value: /^[0-9][0-9]?$/,
              message: "This field must be a positive number less than 100",
            },
          })}
          required={showAsterisks}
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
                {...(formProps as UseFormReturn<ICreateVSRFormInput>).register(
                  `${fieldInputName}.${index}`,
                  {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "This field must be a positive number",
                    },
                    max: {
                      value: 17,
                      message: "Only enter children under 18",
                    },
                  },
                )}
                error={!!formProps.formState.errors[fieldInputName]?.[index]}
                helperText={formProps.formState.errors[fieldInputName]?.[index]?.message}
                required={showAsterisks}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};
