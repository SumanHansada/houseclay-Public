import React from 'react';
import {useField} from 'formik';
import SelectDropdown from '@/base-components/SelectDropdown';

interface Option {
  label: string;
  value: string;
}

interface FormSelectDropdownProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
}

export default function FormSelectDropdown({
  name,
  ...rest
}: FormSelectDropdownProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <SelectDropdown
      value={field.value}
      onChange={(val: string) => helpers.setValue(val)}
      error={meta.error}
      touched={meta.touched}
      {...rest}
    />
  );
}
