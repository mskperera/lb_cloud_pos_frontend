import React from 'react'

const ProductItem = ({ p,handleProductClick }) => {


    return (
      <>
     {p.imageUrl ?   <button
      className='flex flex-col btn h-auto border-none  md:w-[188px] items-center justify-between 
      rounded-lg cursor-pointer py-2 px-2 gap-4 hover:bg-base-300 shadow bg-[#ffffff]'
         onClick={() => handleProductClick(p)}
      >   
      <div className='flex gap-1 h-[55px] w-full justify-between items-center flex-1'>
    <img
              src={p.imageUrl || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqI_tat7hYEmEufBo43aYp4C0pvfcTfF0O_Q&usqp=CAU`}
              alt={p.productName}
              className='w-[50px] h-[50px] rounded-badge object-cover flex-1'
            />
          <div className='flex flex-col gap-2 flex-1 pt-2'>
            <p className='text-md font-semibold text-center text-gray-600'>
             Rs {p.unitPrice}
            </p> 
            <p className='text-[0.9rem] font-normal text-centet text-gray-600'>
           {p.productNo}
            </p> 
            <p className='text-[0.9rem] font-normal  text-center text-gray-600'>
           10{p.measurementUnitName}
            </p> 
            </div>
      </div>
        <p className='text-md font-bold text-center text-gray-600'>{p.productName}</p>
      </button>
:
      <button
      className='flex flex-col btn h-auto border-none  md:w-[188px] items-center justify-between 
      rounded-lg cursor-pointer py-2 px-2 gap-4 hover:bg-base-300 shadow bg-[#ffffff]'
         onClick={() => handleProductClick(p)}
      >   
      <div className='flex gap-1 h-[55px] w-full justify-between items-center flex-1'>
  
          <div className='flex flex-col gap-2 flex-1 pt-2'>
            <p className='text-md font-semibold text-center text-gray-600'>
             Rs {p.unitPrice}
            </p> 
            <p className='text-[0.9rem] font-normal text-centet text-gray-600'>
           {p.productNo}
            </p> 
            <p className='text-[0.9rem] font-normal  text-center text-gray-600'>
           10{p.measurementUnitName}
            </p> 
            </div>
      </div>
        <p className='text-md font-bold text-center text-gray-600'>{p.productName}</p>
      </button>
}
      </>
    );
  };

export default ProductItem