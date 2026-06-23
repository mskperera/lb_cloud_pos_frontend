const Select = ({ children, ...props }) => (
  <select
    className="w-full px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none cursor-pointer transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
    {...props}
  >
    {children}
  </select>
);

export default Select;