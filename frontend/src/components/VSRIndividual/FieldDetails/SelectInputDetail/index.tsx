import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IFormInput } from "@/app/vsr/page";
import Dropdown from "@/components/shared/input/Dropdown";

interface SelectInputDetailProps {
  title: string;
  name: keyof IFormInput;
  options: string[];
  placeholder?: string;
  formProps: UseFormReturn<IFormInput>;
}

/**
 * A component for a dropdown input detail field on the VSR individual pag.e
 */
export const SelectInputDetail = ({
  title,
  name,
  options,
  placeholder,
  formProps,
  ...props
}: SelectInputDetailProps) => {
  return (
    <FieldDetail title={title}>
      <Controller
        name={name}
        control={formProps.control}
        render={({ field }) => (
          <Dropdown
            label=""
            placeholder={placeholder}
            options={options}
            value={field.value as string}
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
