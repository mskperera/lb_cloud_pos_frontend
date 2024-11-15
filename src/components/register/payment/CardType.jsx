const CardType = ({ type, isSelected, onClick }) => {
    return (
      <div
        className="flex"  onClick={onClick}>
        <div className={`cursor-pointer rounded-lg
        
        ${
          isSelected 
            ? "bg-primaryColor text-white hover:bg-primaryColorHover"
            : "bg-gray-200 text-primaryColor "
        }
        
        `}>
          <div className="flex justify-content-center flex-wrap p-3">
            <span className="font-bold">{type.name}</span>
          </div>
        </div>
      </div>
    );
  };

  export default CardType;