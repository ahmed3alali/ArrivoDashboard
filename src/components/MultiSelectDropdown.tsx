// components/MultiSelectDropdown.tsx
import React from 'react';
import Select from 'react-select';

type Option = { label: string; value: string };

interface MultiSelectDropdownProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select items",
}) => {
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={(selected) =>
        onChange(selected ? selected.map((opt) => opt.value) : [])
      }
      placeholder={placeholder}
      className="text-sm"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: '44px',
          borderRadius: '0.5rem',
        }),
      }}
    />
  );
};

export default MultiSelectDropdown;
