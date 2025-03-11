import React from 'react';

const Dropdown = ({
  id,
  value,
  onChange,
  options,
  optionLabel,
  optionValue,
  placeholder,
  className,
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`select select-bordered ${className}`}
    >
      <option disabled value="">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option[optionValue]} value={option[optionValue]}>
          {option[optionLabel]}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
