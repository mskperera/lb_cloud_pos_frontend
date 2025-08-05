const CardType = ({ type, isSelected, onClick }) => {
  return (
    <div className="flex" onClick={onClick}>
      <div
        className={`cursor-pointer rounded-lg py-2 px-4 font-semibold transition-all duration-300 ${
          isSelected
            ? "bg-sky-600 text-white hover:bg-sky-700"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span>{type.name}</span>
      </div>
    </div>
  );
};

export default CardType;
// const CardType = ({ type, isSelected, onClick }) => {
//     return (
//       <div
//         className="flex"  onClick={onClick}>
//         <div className={`cursor-pointer rounded-lg
        
//         ${
//           isSelected 
//             ? "bg-primaryColor text-white hover:bg-primaryColorHover"
//             : "bg-gray-200 text-primaryColor "
//         }
        
//         `}>
//           <div className="flex justify-content-center flex-wrap p-3">
//             <span className="font-bold">{type.name}</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default CardType;