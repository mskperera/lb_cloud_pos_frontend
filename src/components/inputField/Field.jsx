const Field = ({ label, required = false, children, message }) => (
  <div className="flex flex-col gap-2">
    <div className=" font-semibold tracking-[0.4px] text-gray-700 ml-1">
      {label}
      {required && <span className="ml-0.5 text-red-500 font-bold">*</span>}
    </div>
    {children}
    {message}
  </div>
);

export default Field;