import React, { useState } from 'react';

function MultiSelect({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(value || []);

  const handleToggleOption = (option) => {
    let newSelectedValues;
    const index = selectedValues.indexOf(option);
    if (index === -1) {
      const selectedOption = options.find((item) => item.id === option.id);
      console.log('selectedOption',selectedOption)
      newSelectedValues = [...selectedValues, selectedOption.id];
    } else {
        console.log('selectedOption selectedValues',selectedValues)
      newSelectedValues = [...selectedValues];
      newSelectedValues.splice(index, 1);
    }
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };
  

  return (
    <div className="relative">
      <div
        className="border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedValues.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            selectedValues.map((option) => (
              <div key={option.id} className="relative">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {option.displayName}
                </span>
                <button
                  className="absolute right-0 top-0 m-1 p-1 rounded-full bg-red-500 text-white text-xs"
                  onClick={() => handleToggleOption(option)}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 01-.7-.29l-4-4a1 1 0 111.42-1.42L10 9.59l3.29-3.3a1 1 0 111.42 1.42l-4 4a1 1 0 01-.7.29z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full border border-gray-300 rounded-md bg-white mt-1 shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2 cursor-pointer ${
                selectedValues.includes(option)
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleToggleOption(option)}
            >
              {option.displayName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
