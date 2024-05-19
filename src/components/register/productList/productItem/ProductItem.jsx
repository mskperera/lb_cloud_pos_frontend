import React from 'react'
import './productItem.css';

const ProductItem = ({ p,handleProductClick }) => {
    return (
      <button
      className='productMenuItem'
         onClick={() => handleProductClick(p)}
      >   
            <img
              src={p.imageUrl || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqI_tat7hYEmEufBo43aYp4C0pvfcTfF0O_Q&usqp=CAU`}
              alt={p.productName}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
              className='productMenuImage'
            />
     
        <div className='textContainer'>
            <div style={{fontSize:'1rem'}}>{p.productName}</div>
            <div style={{fontSize:'1.1rem'}}>
             Rs {p.unitPrice}
            </div>
     
        </div>
      
       
    
      </button>
    );
  };

export default ProductItem