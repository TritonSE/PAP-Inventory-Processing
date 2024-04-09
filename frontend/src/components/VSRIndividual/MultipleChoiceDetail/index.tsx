import { Chip } from "@mui/material";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import { Controller, FieldErrors, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "../FieldDetail";
import { IFormInput } from "@/app/vsr/page";

interface MultipleChoiceDetailProps {
  title: string;
  options: string[];
  name: keyof IFormInput;
  placeholder?: string;
  formProps: UseFormReturn<IFormInput>;
}

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
            variant="outlined"
            name={name}
            placeholder={placeholder}
            value={field.value}
            onChange={field.onChange}
            required
            error={!!(formProps.formState.errors as any)[name]}
            helperText={(formProps.formState.errors as any)[name]?.message as string}
            {...props}
          />
        )}
      />
    </FieldDetail>
  );
};
