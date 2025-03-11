export const validate = (value, state) => {
    let isValid = true;
    let messages = [];
  
    const { rules } = state;
    let trimmedValue = "";
    switch (rules.dataType) {
      case "bool":
        trimmedValue = value;
        if (rules.required && trimmedValue === null) {
          isValid = false;
          messages.push(`${state.label} is required`);
        }
        break;
      case "string":
        trimmedValue = value.toString().trim();
        if (rules.required && trimmedValue === "") {
          isValid = false;
          messages.push(`${state.label} is required`);
        }
        if (rules.minLength && trimmedValue.length < rules.minLength) {
          isValid = false;
          messages.push("minLength");
        }
        break;
      case "integer":
      case "decimal":
        trimmedValue = value.toString().trim();
        if (rules.required && trimmedValue === "") {
          isValid = false;
          messages.push(`${state.label} is required`);
        }
        const numValue = Number(trimmedValue);
        if (isNaN(numValue) || !isFinite(numValue)) {
          isValid = false;
          messages.push("invalid number");
        } else {
          if (rules.type === "integer" && !Number.isInteger(numValue)) {
            isValid = false;
            messages.push("not an integer");
          }
          if (rules.minValue !== undefined && numValue < rules.minValue) {
            isValid = false;
            messages.push("minValue");
          }
          if (rules.maxValue !== undefined && numValue > rules.maxValue) {
            isValid = false;
            messages.push("maxValue");
          }
        }
        break;


        case "datetime":
          // Validate datetime
          trimmedValue = value.toString().trim();
          const dateValue = new Date(trimmedValue);
          if (rules.required && (trimmedValue === "" || isNaN(dateValue.getTime()))) {
            isValid = false;
            messages.push(`${state.label} is required or invalid`);
          } else if (!isNaN(dateValue.getTime())) {
            if (rules.minDate && dateValue < new Date(rules.minDate)) {
              isValid = false;
              messages.push(`${state.label} must be after ${rules.minDate}`);
            }
            if (rules.maxDate && dateValue > new Date(rules.maxDate)) {
              isValid = false;
              messages.push(`${state.label} must be before ${rules.maxDate}`);
            }
          }
          break;

        case "cardExpiration":
      // Assuming value is in MM/YY format
      trimmedValue = value.toString().trim();
      if (trimmedValue.length !== 5 || trimmedValue[2] !== '/') {
        isValid = false;
        messages.push("Invalid format, use MM/YY");
      } else {
        const [month, year] = trimmedValue.split('/').map(num => parseInt(num, 10));
        const currentYear = new Date().getFullYear() % 100; // Get last two digits
        const currentMonth = new Date().getMonth() + 1; // January is 0

        if (month < 1 || month > 12) {
          isValid = false;
          messages.push("Invalid month");
        }
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          isValid = false;
          messages.push("Card is expired");
        }
      }
      break;
  
      case "dropdownObject":
        trimmedValue = value;
        if (
          rules.required &&
          (trimmedValue === "" || trimmedValue === null || trimmedValue === 0)
        ) {
          isValid = false;
          messages.push(`${state.label} is required`);
        }
  
        break;
  
        case "integerArray":
      // Check if the value is an array
      if (!Array.isArray(value)) {
        isValid = false;
        messages.push(`${state.label} must be an array`);
      } else {
        // Check if the array is required and empty
        if (rules.required && value.length === 0) {
          isValid = false;
          messages.push(`${state.label} is required`);
        }
        // Validate each element in the array
        value.forEach((element, index) => {
          const numValue = Number(element);
          if (isNaN(numValue) || !isFinite(numValue) || !Number.isInteger(numValue)) {
            isValid = false;
            messages.push(`Element at index ${index} is not an integer`);
          }
          if (rules.minValue !== undefined && numValue < rules.minValue) {
            isValid = false;
            messages.push(`Element at index ${index} is less than minimum value`);
          }
          if (rules.maxValue !== undefined && numValue > rules.maxValue) {
            isValid = false;
            messages.push(`Element at index ${index} exceeds maximum value`);
          }
        });
      }
      break;
      // Add cases for other types as needed
    }
  
    return { isValid, messages };
  };