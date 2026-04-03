import React from 'react';
import {type ViewStyle} from 'react-native';
import TextField from './TextField';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  containerStyle?: ViewStyle;
}

export default function TextArea({
  numberOfLines = 4,
  containerStyle,
  ...props
}: TextAreaProps) {
  return (
    <TextField
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      containerStyle={containerStyle}
      {...props}
    />
  );
}
