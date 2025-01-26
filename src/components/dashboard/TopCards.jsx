

const TopCards=({selectedDate})=>{

return(
 
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        <div className="flex flex-col justify-between transform bg-white p-4 rounded-lg shadow-sm">
             
             <div className='flex justify-between'>
              <h3 className="text-lg font-semibold text-gray-500">Transactions</h3>
             
              <p className="text-xl font-bold">100</p>
              </div>

              <div className='flex justify-between items-end'>
              <div className='flex flex-col items-start'>
                <p className='font-semibold text-green-500'>Completed</p>
                <p className=' text-green-500'>98</p>
              </div>
              <div className='flex flex-col items-end'>
                <p className='font-semibold text-red-500'>Voided</p>
                <p className='text-red-500'>2</p>
              </div>
           
          </div>
           
            </div>

         
          {[

            { label: 'Today Revenue', value: '$5,000' },
            { label: 'Today Profit', value: '$3,500' },
            { label: 'ATV', value: '$300' },
            { label: 'Receipts Printed', value: '300' },      
            { label: 'Refunds', value: '$300' },
            { label: 'Items Sold', value: 450 },
       
            { label: 'Unique Customers', value: 60 },
          ].map((card, index) => (
            <div key={index} className="flex flex-col justify-between h-28 bg-white p-4 rounded-lg shadow-sm ">
              <h3 className="text-lg font-semibold text-gray-500">{card.label}</h3>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          ))}

        </div>
 
)
}

export default TopCards;