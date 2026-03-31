const Field = ({ label, required = false, children, message }) => (
  <div className="flex flex-col gap-1.5">
    <div className="text-mdfont-semibold tracking-[0.4px] text-[#6D6D72]">
      {label}
      {required && <span className="ml-0.5 text-[#007AFF]">*</span>}
    </div>
    {children}
    {message}
  </div>
);

export default Field;