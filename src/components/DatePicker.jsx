import React, { useState } from "react";

export default function DatePicker() {
  const [date, setDate] = useState("");

  return (
    <div className="flex flex-col items-center w-full">
      <label htmlFor="datePicker" className="mb-2 font-semibold">
        Select a Date
      </label>
      <input
        type="date"
        id="datePicker"
        className="input input-bordered w-full max-w-xs"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
  );
}
