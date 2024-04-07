import { Controller, UseFormReturn } from "react-hook-form";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import Dropdown from "@/components/shared/input/Dropdown";
import { vsrInputFieldValidators } from "@/components/VSRForm/VSRFormValidators";

interface SelectInputDetailProps {
  title: string;
  name: keyof IEditVSRFormInput;
  options: string[];
  placeholder?: string;
  formProps: UseFormReturn<IEditVSRFormInput>;
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
        rules={vsrInputFieldValidators[name]}
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
