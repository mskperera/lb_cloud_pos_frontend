
import React, { useState } from "react";
import { InputSwitch } from "primereact/inputswitch";

export default function InputSwitchCustom({label}) {
    const [checked, setChecked] = useState(true);

    return (
        <div className="card flex justify-content-around">
            <div >
                <span className="mr-3">{label}</span>
            <InputSwitch  checked={checked} onChange={(e) => setChecked(e.value)} />
            </div>
    
        </div>
    );
}
        