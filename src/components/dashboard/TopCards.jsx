const TopCards = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;  // or some other loading state
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
      <div className="flex flex-col justify-between transform bg-white p-4 rounded-lg shadow-sm">
        <div className='flex justify-between'>
          <h3 className="text-lg font-semibold text-gray-500">Transactions</h3>
          <p className="text-xl font-bold">{data.noOfTransactions}</p>
        </div>
        <div className='flex justify-between items-end'>
          <div className='flex flex-col items-start'>
            <p className='font-semibold text-green-500'>Completed</p>
            <p className='text-green-500'>{data.noOfUnVoidedTransactions}</p>
          </div>
          <div className='flex flex-col items-end'>
            <p className='font-semibold text-red-500'>Voided</p>
            <p className='text-red-500'>{data.noOfVoidedTransactions}</p>
          </div>
        </div>
      </div>

      {[
        { label: 'Today Revenue', value: `$${data.productSales}` },
        { label: 'Today Profit', value: `$${data.netSales}` },
        { label: 'ATV', value: `$${data.averageTransactionValueNet}` },
        { label: 'Receipts Printed', value: data.noOfProductsSold },
        { label: 'Refunds', value: `$${data.totalRefunds}` },
        { label: 'Items Sold', value: data.noOfProductsSold },
        { label: 'Unique Customers', value: data.noOfCustomers },
        { label: 'Opening Cash', value: `$${data.openingCashAmount}` },
        { label: 'Expected Cash', value: `$${data.expectedCash}` },
      ].map((card, index) => (
        <div key={index} className="flex flex-col justify-between h-28 bg-white p-4 rounded-lg shadow-sm ">
          <h3 className="text-lg font-semibold text-gray-500">{card.label}</h3>
          <p className="text-xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TopCards;
