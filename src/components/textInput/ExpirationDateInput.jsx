function ExpirationDateInput({ value, onChange, className = "" }) {
  const handleExpirationChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, "");

    if (inputValue.length > 4) {
      inputValue = inputValue.slice(0, 4);
    }

    if (inputValue.length > 2) {
      inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2)}`;
    }

    onChange(inputValue);
  };

  return (
    <input
      type="text"
      className={className}
      placeholder="MM/YY"
      value={value}
      onChange={handleExpirationChange}
      maxLength="5"
    />
  );
}

export default ExpirationDateInput;