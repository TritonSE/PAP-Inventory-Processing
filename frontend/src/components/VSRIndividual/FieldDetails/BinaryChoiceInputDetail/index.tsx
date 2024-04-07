import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import BinaryChoice from "@/components/shared/input/BinaryChoice";
import { vsrInputFieldValidators } from "@/components/VSRForm/VSRFormValidators";

interface BinaryChoiceInputDetailProps {
  title: string;
  name: keyof IEditVSRFormInput;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 * A component for a binary choice input field on the VSR individual page.
 */
export const BinaryChoiceInputDetail = ({
  title,
  name,
  formProps,
  ...props
}: BinaryChoiceInputDetailProps) => {
  return (
    <FieldDetail title={title}>
      <Controller
        name={name}
        control={formProps.control}
        rules={vsrInputFieldValidators[name]}
        render={({ field }) => (
          <BinaryChoice
            label=""
            value={field.value as boolean}
            onChange={field.onChange}
            required={false}
            error={!!formProps.formState.errors[name]}
            helperText={formProps.formState.errors[name]?.message as string}
            {...props}
          />
        )}
      />
    </FieldDetail>
  );
};
