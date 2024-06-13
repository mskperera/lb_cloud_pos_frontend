import React from 'react'

const ProductItem = ({ p,handleProductClick }) => {


    return (
      <button
      className='flex flex-col btn h-auto border-none bg-base-200 md:w-[200px] items-start justify-between 
      rounded-lg cursor-pointer py-2 px-2 gap-2 hover:bg-base-300'
         onClick={() => handleProductClick(p)}
      >   
      <div className='flex gap-1 h-[55px] w-full justify-between items-center'>
      <img
              src={p.imageUrl || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqI_tat7hYEmEufBo43aYp4C0pvfcTfF0O_Q&usqp=CAU`}
              alt={p.productName}
              className='w-[60px] h-[50px] rounded-badge object-cover flex-1'
            />
            <p className='text-[1rem] font-semibold flex-1 text-center'>
             Rs {p.unitPrice}
            </p> 
      </div>
        <p className='text-[1rem] font-normal text-left'>{p.productName}</p>
      </button>
    );
  };

export default ProductItem