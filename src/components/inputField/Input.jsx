import React from "react";

const Input = React.forwardRef((props, ref) => (
  <input
    ref={ref}
    className={`w-full px-3.5 py-2.5 text-gray-700 border border-gray-300 
    rounded-lg outline-gray-400 duration-150 placeholder:text-gray-500
     placeholder:font-semibold`}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;