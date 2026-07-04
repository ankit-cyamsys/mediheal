export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  className?: string;
};
