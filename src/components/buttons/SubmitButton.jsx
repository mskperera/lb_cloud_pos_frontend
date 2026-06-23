


const SubmitButton = ({ text, disabled }) => {
  return (
      <button
                type="submit"
                disabled={disabled}
                className="w-full lg:w-auto min-w-[220px] py-3.5 bg-sky-600 text-white text-lg font-bold rounded-full flex items-center justify-center gap-2 transition-all hover:bg-sky-700 hover:shadow-sm disabled:opacity-55 disabled:cursor-not-allowed"
              >
                    {text}   
              </button>

  )
};


  export default SubmitButton;