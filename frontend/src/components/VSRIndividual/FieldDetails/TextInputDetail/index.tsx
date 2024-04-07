import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import TextField from "@/components/shared/input/TextField";
import { vsrInputFieldValidators } from "@/components/VSRForm/VSRFormValidators";

interface TextInputDetailProps {
  title: string;
  name: keyof IEditVSRFormInput;
  placeholder?: string;
  formProps: UseFormReturn<IEditVSRFormInput>;
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
            placeholder={placeholder}
            {...formProps.register(name, vsrInputFieldValidators[name])}
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
