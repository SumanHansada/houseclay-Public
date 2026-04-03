import React from 'react';
import {useField} from 'formik';

interface InjectedFormikProps {
  value: string;
  error?: string;
  touched: boolean;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

interface WithFormikFieldProps {
  name: string;
}

export default function withFormikField<P extends object>(
  WrappedComponent: React.ComponentType<P & InjectedFormikProps>,
) {
  function FormikField(props: Omit<P, keyof InjectedFormikProps> & WithFormikFieldProps) {
    const {name, ...rest} = props;
    const [field, meta, helpers] = useField(name);

    const injected: InjectedFormikProps = {
      value: field.value ?? '',
      error: meta.error,
      touched: meta.touched,
      onChangeText: (text: string) => helpers.setValue(text),
      onBlur: () => helpers.setTouched(true),
    };

    return <WrappedComponent {...(rest as P)} {...injected} />;
  }

  FormikField.displayName = `withFormikField(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return FormikField;
}
