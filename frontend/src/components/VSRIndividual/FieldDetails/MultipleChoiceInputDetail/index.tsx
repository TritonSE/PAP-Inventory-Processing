import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import { vsrInputFieldValidators } from "@/components/VSRForm/VSRFormValidators";

interface MultipleChoiceInputDetailProps {
  title: string;
  name: keyof IEditVSRFormInput;
  options: string[];
  allowMultiple: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 * A component for a multiple choice input field on the VSR individual page.
 */
export const MultipleChoiceInputDetail = ({
  title,
  name,
  options,
  allowMultiple,
  formProps,
  ...props
}: MultipleChoiceInputDetailProps) => {
  return (
    <FieldDetail title={title}>
      <Controller
        name={name}
        control={formProps.control}
        rules={vsrInputFieldValidators[name]}
        render={({ field }) => (
          <MultipleChoice
            label=""
            options={options}
            value={field.value as string | string[]}
            onChange={field.onChange}
            required={false}
            error={!!formProps.formState.errors[name]}
            helperText={formProps.formState.errors[name]?.message as string}
            allowMultiple={allowMultiple}
            {...props}
          />
        )}
      />
    </FieldDetail>
  );
};
