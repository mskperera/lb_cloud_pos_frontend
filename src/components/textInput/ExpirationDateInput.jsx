

function ExpirationDateInput({ value, onChange }) {
  const handleExpirationChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (inputValue.length > 4) {
      inputValue = inputValue.slice(0, 4); // Limit to 4 characters
    }

    if (inputValue.length > 2) {
      inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2)}`; // Insert slash
    }

    onChange(inputValue);
  };

  return (
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="MM/YY"
        value={value}
        onChange={handleExpirationChange}
        maxLength="5" // Limit the input length to 5 characters (MM/YY)
      />

  );
}

export default ExpirationDateInput;