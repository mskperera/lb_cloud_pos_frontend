const Input = (props) => (
  <input
    className="w-full px-3.5 py-2.5 text-[14px] font-medium text-[#1C1C1E] bg-[#F9F9FB] border-[1.5px] border-[#E5E5EA] rounded-[13px] outline-none transition-[border,box-shadow,background] duration-150 placeholder:text-[#AEAEB2] placeholder:font-normal focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3.5px_rgba(0,122,255,0.22)] read-only:bg-[#F2F2F7]"
    {...props}
  />
);

export default Input;