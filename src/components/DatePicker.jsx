
import React, { useState } from "react";
import { Calendar } from 'primereact/calendar';

export default function DatePicker() {
    const [date, setDate] = useState(null);

    return (
        <div className="card flex justify-content-center w-full">
            <Calendar className="w-full" value={date} onChange={(e) => setDate(e.value)} showButtonBar
            dateFormat="dd M yy"
            />
        </div>
    )
}