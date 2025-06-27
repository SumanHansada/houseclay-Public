import { useField } from "formik";
import React from "react";

type OmitFormikProps<P> = Omit<P, "value" | "onChange" | "onBlur" | "error">;

interface FormikFieldProps<T = unknown> {
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: string;
}

function withFormikField<P extends { name: string }>(
  WrappedComponent: React.ComponentType<P & FormikFieldProps>,
): React.FC<OmitFormikProps<P>> {
  return function WithFormikField(props: OmitFormikProps<P>) {
    const { name, ...rest } = props;
    const [field, meta, helpers] = useField(name);

    return React.createElement(WrappedComponent, {
      ...(rest as P),
      name,
      value: field.value,
      onChange: helpers.setValue,
      onBlur: () => helpers.setTouched(true),
      error: meta.touched && meta.error ? meta.error : "",
    });
  };
}

export default withFormikField;
