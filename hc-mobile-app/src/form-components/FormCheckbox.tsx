import React from 'react';
import {useField} from 'formik';
import Checkbox from '@/base-components/Checkbox';

interface FormCheckboxProps {
  name: string;
  label: string;
}

export default function FormCheckbox({name, label}: FormCheckboxProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <Checkbox
      label={label}
      checked={!!field.value}
      onChange={(checked: boolean) => helpers.setValue(checked)}
      error={meta.error}
      touched={meta.touched}
    />
  );
}
