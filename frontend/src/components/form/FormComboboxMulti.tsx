import { type ReactNode } from 'react';
import type { Combobox as ComboboxPrimitive } from '@base-ui/react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxValue,
  ComboboxItem,
  useComboboxAnchor,
} from '@/components/ui/combobox';

import { FormBase, type FormControlProps } from './FormBase';

type FormComboboxMultiProps<TItem, TValue extends string | number> = {
  items: readonly TItem[];
  getValue: (item: TItem) => TValue;
  getSearchText: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
  renderChip: (value: TValue) => ReactNode;
  placeholder?: string;
  comboboxProps?: Omit<
    ComboboxPrimitive.Root.Props<TValue, true>,
    'value' | 'onValueChange' | 'multiple' | 'items'
  >;
};

function FormComboboxMulti<
  TItem,
  TValue extends string | number,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  items,
  getValue,
  getSearchText,
  renderItem,
  renderChip,
  placeholder,
  comboboxProps,
  ...props
}: FormComboboxMultiProps<TItem, TValue> &
  FormControlProps<TFieldValues, TName>) {
  const anchor = useComboboxAnchor();

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
      }) => {
        const selected: TValue[] = Array.isArray(value) ? value : [];
        const values = items.map(getValue);

        const getItemByValue = (comboboxValue: TValue) =>
          items.find((item) => getValue(item) === comboboxValue);

        const itemToStringLabel = (comboboxValue: TValue) => {
          const item = getItemByValue(comboboxValue);
          return item ? getSearchText(item) : String(comboboxValue);
        };

        return (
          <Combobox<TValue, true>
            multiple
            items={values}
            value={selected}
            onValueChange={onChange}
            name={name}
            itemToStringLabel={itemToStringLabel}
            {...comboboxProps}
          >
            <ComboboxChips ref={anchor} className="w-full">
              <ComboboxValue>
                {(currentValues) => {
                  const selectedValues: TValue[] = Array.isArray(currentValues)
                    ? currentValues
                    : [];

                  return (
                    <>
                      {selectedValues.map((val) => (
                        <ComboboxChip key={String(val)}>
                          {renderChip(val)}
                        </ComboboxChip>
                      ))}

                      <ComboboxChipsInput
                        ref={ref}
                        id={id}
                        onBlur={onBlur}
                        aria-invalid={ariaInvalid}
                        placeholder={
                          selectedValues.length === 0 ? placeholder : undefined
                        }
                      />
                    </>
                  );
                }}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No items found</ComboboxEmpty>
              <ComboboxList>
                {(value) => {
                  const item = getItemByValue(value);
                  if (!item) return null;

                  return (
                    <ComboboxItem key={String(value)} value={value}>
                      {renderItem(item)}
                    </ComboboxItem>
                  );
                }}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FormBase>
  );
}

export default FormComboboxMulti;
