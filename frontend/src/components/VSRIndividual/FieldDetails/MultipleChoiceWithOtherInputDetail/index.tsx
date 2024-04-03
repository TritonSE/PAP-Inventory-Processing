import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IFormInput } from "@/app/vsr/page";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import TextField from "@/components/shared/input/TextField";

interface MultipleChoiceWithOtherInputDetailProps {
  title: string;
  name: keyof IFormInput;
  otherName: keyof IFormInput;
  options: string[];
  allowMultiple: boolean;
  formProps: UseFormReturn<IFormInput>;
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
  options,
  allowMultiple,
  formProps,
  ...props
}: MultipleChoiceWithOtherInputDetailProps) => {
  return (
    <FieldDetail title={title}>
      <Controller
        name={name}
        control={formProps.control}
        render={({ field }) => (
          <MultipleChoice
            label=""
            options={options}
            value={field.value as string | string[]}
            onChange={(value) => {
              field.onChange(value);
              if (!allowMultiple && value.length > 0) {
                // If user can't enter multiple options, clear the "other" text field when they select an option
                formProps.setValue(otherName, "");
              }
            }}
            required={false}
            error={!!formProps.formState.errors[name]}
            helperText={formProps.formState.errors[name]?.message as string}
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
                field.onChange(value);
                if (!allowMultiple && value.length > 0) {
                  // If user can't enter multiple options, clear the chips field when
                  // they enter something into the "other" text field
                  formProps.setValue(name, "");
                }
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
