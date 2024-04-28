import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import TextField from "@/components/shared/input/TextField";
import { vsrInputFieldValidators } from "@/components/VSRForm/VSRFormValidators";

interface MultipleChoiceWithOtherInputDetailProps {
  title: string;
  name: keyof IEditVSRFormInput;
  otherName: keyof IEditVSRFormInput;
  formName: keyof IEditVSRFormInput;
  options: string[];
  allowMultiple: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 *
 * A component for a multiple choice input field on the VSR individual page,
 * that also renders a text field below, for the fields with an "Other" option.
 */
export const MultipleChoiceWithOtherInputDetail = ({
  title,
  name,
  otherName,
  formName,
  options,
  allowMultiple,
  formProps,
  ...props
}: MultipleChoiceWithOtherInputDetailProps) => {
  /**
   * Callback fired when one of the inputs (multiple choice or "Other" text input) changes,
   * to handle the change and update all our form inputs
   *
   * @param fieldValue the new value of the multiple choice field
   * @param otherFieldValue the new value of the "Other" field
   * @param otherJustChanged whether the "Other" field just changed (if true), or the multiple
   * choice field just changed (if false)
   * @param onOtherChange callback to fire when "Other" input changes; since this changes often
   * (every time the user presses a key), we want this to be fast, so we use the field.onChange
   * instead of formProps.setValue()
   */
  const handleInputChange = (
    fieldValue: string | string[],
    otherFieldValue: string,
    otherJustChanged: boolean,
    onOtherChange: (value: string) => unknown,
  ) => {
    // Whether either field is non-empty (used to determine whether there is a form error)
    const isNonEmpty =
      (allowMultiple ? (fieldValue as string[]).length > 0 : fieldValue.toString().length > 0) ||
      otherFieldValue.length > 0;

    // Update both fields to their new values. If we don't allow multiple, clear the
    // field (multiple vs. other) that didn't just change
    if (otherJustChanged) {
      formProps.setValue(name, allowMultiple ? fieldValue : "");
      onOtherChange(otherFieldValue);
    } else {
      formProps.setValue(name, fieldValue);
      formProps.setValue(otherName, allowMultiple ? otherFieldValue : "");
    }

    // Update our formName phantom field to store whether the field is empty and
    // throw a validation error if so
    formProps.setValue(formName, isNonEmpty ? "full" : "");
  };

  return (
    <FieldDetail title={title}>
      <Controller
        name={formName}
        control={formProps.control}
        rules={vsrInputFieldValidators[name]}
        render={() => (
          <MultipleChoice
            label=""
            options={options}
            value={formProps.getValues()[name] as string | string[]}
            onChange={(value) => {
              handleInputChange(
                value,
                formProps.getValues()[otherName] as string,
                false,
                (otherValue) => formProps.setValue(otherName, otherValue),
              );
            }}
            required={false}
            error={!!formProps.formState.errors[formName]}
            helperText={formProps.formState.errors[formName]?.message as string}
            allowMultiple={allowMultiple}
            {...props}
          />
        )}
      />
      <Controller
        name={otherName}
        control={formProps.control}
        render={({ field }) => (
          <div style={{ marginTop: 24 }}>
            <TextField
              label="Other"
              type="text"
              placeholder="Please specify"
              value={field.value}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange(
                  formProps.getValues()[name] as string | string[],
                  value,
                  true,
                  field.onChange,
                );
              }}
              variant={"outlined"}
              required={false}
            />
          </div>
        )}
      />
    </FieldDetail>
  );
};
