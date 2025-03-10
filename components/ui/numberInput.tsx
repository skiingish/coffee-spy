'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Input } from './input';

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  decimalPlaces?: number;
  min?: number;
  max?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, decimalPlaces = 2, min, max, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Handle empty input
      if (inputValue === '') {
        onChange(undefined);
        return;
      }

      // Parse input to float
      const parsedValue = parseFloat(inputValue);

      if (!isNaN(parsedValue)) {
        // Round to specified decimal places
        const factor = Math.pow(10, decimalPlaces);
        const formattedValue = Math.round(parsedValue * factor) / factor;

        // Apply min/max constraints
        if (min !== undefined && formattedValue < min) {
          onChange(min);
        } else if (max !== undefined && formattedValue > max) {
          onChange(max);
        } else {
          onChange(formattedValue);
        }
      }
    };

    // Calculate step based on decimal places
    const step = decimalPlaces ? `0.${'0'.repeat(decimalPlaces - 1)}1` : '1';

    return (
      <Input
        type='number'
        value={value === undefined ? '' : value}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
        ref={ref}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
