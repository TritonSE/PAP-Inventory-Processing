import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IFormInput } from "@/app/vsr/page";
import TextField from "@/components/shared/input/TextField";

interface TextInputDetailProps {
  title: string;
  name: keyof IFormInput;
  placeholder?: string;
  formProps: UseFormReturn<IFormInput>;
  type?: string;
}

/**
 * A component for a text input detail field on the VSR individual page.
 */
export const TextInputDetail = ({
  title,
  name,
  placeholder,
  formProps,
  ...props
}: TextInputDetailProps) => {
  return (
    <FieldDetail title={title}>
      <Controller
        name={name}
        control={formProps.control}
        render={({ field }) => (
          <TextField
            label=""
            variant="outlined"
            name={name}
            placeholder={placeholder}
            value={field.value}
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
