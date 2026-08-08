import {
  MoreVertical,
  PercentCircle,
  Trash2,
  Edit3,
  PlusCircle,
  ArrowLeftRight
} from "lucide-react";


const OrderProductActionMenu = ({
  product,
  openMenuId,
  setOpenMenuId,
  handleDiscountClick,
  handleRemove,
  handleChangeUnitClick
}) => {


  const isOpen =
    openMenuId === product.orderListId;


  return (

    <div
      className="
        relative
        flex
        justify-center
      "
    >

      <button
        onClick={() =>
          setOpenMenuId(
            isOpen
            ? null
            : product.orderListId
          )
        }

        className="
          w-9
          h-9
          rounded-lg
          border
          border-slate-300
          bg-white
          text-slate-600
          flex
          items-center
          justify-center
          hover:bg-slate-100
          hover:border-slate-400
          transition
        "
      >

        <MoreVertical size={18}/>

      </button>



      {
      isOpen &&

      <div
        className="
          absolute
          right-0
          top-11
          w-48
          bg-white
          border
          border-slate-200
          rounded-xl
          shadow-xl
          z-50
          py-2
        "
      >

          <button
                      onClick={() => {
                        handleChangeUnitClick(product);
                        setOpenMenuId(null);
                      }}
                        className="
            w-full
            px-4
            py-2.5
            flex
            items-center
            gap-3
            text-sm
            hover:bg-slate-50
          "
                    >
                      <ArrowLeftRight size={18} className="text-blue-600" />
                      Change Unit
                    </button>


        <button
          onClick={()=>{
            handleDiscountClick(product);
            setOpenMenuId(null);
          }}

          className="
            w-full
            px-4
            py-2.5
            flex
            items-center
            gap-3
            text-sm
            hover:bg-slate-50
          "
        >

          <PercentCircle
            size={16}
            className="text-green-600"
          />

          Discount

        </button>




        <div
          className="
            border-t
            border-slate-100
            my-1
          "
        />



        <button
          onClick={()=>{
            handleRemove(product);
            setOpenMenuId(null);
          }}

          className="
            w-full
            px-4
            py-2.5
            flex
            items-center
            gap-3
            text-sm
            text-red-600
            hover:bg-red-50
          "
        >

          <Trash2 size={16}/>

          Remove

        </button>


      </div>

      }


    </div>

  );
};


export default OrderProductActionMenu;