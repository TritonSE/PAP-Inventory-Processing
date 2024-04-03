import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IFormInput } from "@/app/vsr/page";
import BinaryChoice from "@/components/shared/input/BinaryChoice";

interface BinaryChoiceInputDetailProps {
  title: string;
  name: keyof IFormInput;
  formProps: UseFormReturn<IFormInput>;
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
