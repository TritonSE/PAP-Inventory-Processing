import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IFormInput } from "@/app/vsr/page";
import MultipleChoice from "@/components/shared/input/MultipleChoice";

interface MultipleChoiceInputDetailProps {
  title: string;
  name: keyof IFormInput;
  options: string[];
  allowMultiple: boolean;
  formProps: UseFormReturn<IFormInput>;
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
