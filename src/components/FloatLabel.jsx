
import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

export default function FloatLabel() {
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);

    const search = (event) => {
        setItems([...Array(10).keys()].map(item => event.query + '-' + item));
    }

    return (
        <div className="card flex justify-content-center">
            <span className="p-float-label">
                <AutoComplete inputId="ac" value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)} />
                <label htmlFor="ac">Float Label</label>
            </span>
        </div>
    )
}
        