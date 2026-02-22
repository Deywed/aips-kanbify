import type { ComponentProps } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar02Icon } from '@hugeicons/core-free-icons';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { FormBase, type FormControlFunc } from './FormBase';

type FormBasicDatePickerProps = {
  placeholder?: string;
  calendarProps?: Omit<
    ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect'
  >;
};

const FormBasicDatePicker: FormControlFunc<FormBasicDatePickerProps> = ({
  placeholder = 'Pick a date',
  calendarProps,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ value, onChange, onBlur, id, ref, 'aria-invalid': ariaInvalid }) => (
        <Popover>
          <PopoverTrigger
            ref={ref}
            render={
              <Button
                variant="outline"
                id={id}
                aria-invalid={ariaInvalid}
                onBlur={onBlur}
                className={cn(
                  'w-full justify-start font-normal',
                  !value && 'text-muted-foreground',
                )}
              >
                <HugeiconsIcon icon={Calendar02Icon} className="size-4" />
                {value ? format(value, 'PPP') : <span>{placeholder}</span>}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              defaultMonth={value}
              {...calendarProps}
            />
          </PopoverContent>
        </Popover>
      )}
    </FormBase>
  );
};

export default FormBasicDatePicker;
