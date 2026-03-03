import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/useDebounce';

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceDelay?: number;
  onClear?: () => void;
  inputClassName?: string;
  showClearButton?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput = ({
  value,
  defaultValue = '',
  onValueChange,
  onDebouncedChange,
  onClear,
  debounceDelay = 300,
  showClearButton = true,
  className,
  inputClassName,
  placeholder = 'Search',
  disabled,
  onChange,
  ...props
}: SearchInputProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const debouncedValue = useDebounce(currentValue, debounceDelay);

  const canClear = useMemo(
    () => showClearButton && !disabled && currentValue.length > 0,
    [showClearButton, disabled, currentValue],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }

    onValueChange?.('');
    onClear?.();
  };

  useEffect(() => {
    if (onDebouncedChange) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange]);

  return (
    <InputGroup className={className}>
      <InputGroupAddon align="inline-start">
        <HugeiconsIcon icon={Search01Icon} />
      </InputGroupAddon>

      <InputGroupInput
        {...props}
        disabled={disabled}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        aria-label={props['aria-label'] ?? placeholder}
        className={inputClassName}
      />

      {canClear && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default SearchInput;
