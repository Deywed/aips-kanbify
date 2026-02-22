import type { ComponentProps, ReactNode } from 'react';

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FormBase, type FormControlProps } from './FormBase';
import type { FieldPath, FieldValues } from 'react-hook-form';

type FormSelectProps<TValue = string> = {
  children: ReactNode;
  placeholder?: ReactNode;
  renderValue?: (value: TValue) => ReactNode;
  selectProps?: Omit<
    ComponentProps<typeof Select>,
    'value' | 'onValueChange' | 'name'
  >;
  triggerProps?: ComponentProps<typeof SelectTrigger>;
  contentProps?: ComponentProps<typeof SelectContent>;
};

function FormSelect<
  TValue = string,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  placeholder,
  renderValue,
  selectProps,
  triggerProps,
  contentProps,
  ...props
}: FormSelectProps<TValue> &
  FormControlProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <FormBase {...props}>
      {({
        value,
        onChange,
        onBlur,
        name,
        id,
        ref,
        'aria-invalid': ariaInvalid,
      }) => (
        <Select
          name={name}
          value={value ?? null}
          onValueChange={onChange}
          {...selectProps}
        >
          <SelectTrigger
            ref={ref}
            aria-invalid={ariaInvalid}
            id={id}
            onBlur={onBlur}
            {...triggerProps}
          >
            <SelectValue placeholder={placeholder}>{renderValue}</SelectValue>
          </SelectTrigger>
          <SelectContent {...contentProps}>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
}

export default FormSelect;
