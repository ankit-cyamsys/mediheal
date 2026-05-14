import { type TextInputProps } from 'react-native';

export type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label?: string;
  error?: string;
};
