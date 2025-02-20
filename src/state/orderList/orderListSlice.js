import { createSlice } from "@reduxjs/toolkit"
import Decimal from 'decimal.js';
import { DISCOUNT_TYPES, PAYMENT_METHODS } from "../../utils/constants";


const initialState = {
    list: [],
    nextOrderListId: 1,
    orderSummary: {
        subtotal: 0,
        discounts:0,
        lineDiscounts: 0,
        overallDiscounts:0,
        overallDiscountValue: 0,
        overallDiscountTypeId:DISCOUNT_TYPES.NONE, // 'percentage', 'amount', or 'none'
        overallDiscountReasonId:'',
        overallDiscountReasonName:'',
        overallDiscountReasonRemark:'',
        netTotal: 0,
        overallTax: 0,
        totalLineTax:0,
        totalTax:0,
        grandTotal: 0,
        cashBalance:0,
        shortfall:0,
        remainingPaymentAmount:0,
        cashBalanceException:'',
        isRecevedAmountTouched:false,
    },
    isMultiPayment:null,
    paymentList:[],
  overallTaxRate:0,
    customer:null

}

const orderListSlice = createSlice({
    name: "orderList",
    initialState,
    reducers: {
      setCustomer:(state,action)=>{
        const {customer}=action.payload;
        state.customer=customer;
      },
      clearOrderList: (state) => {
        state.list = [];
        state.nextOrderListId = 1;
        state.orderSummary = {
            subtotal: 0,
            discounts: 0,
            lineDiscounts: 0,
            overallDiscounts: 0,
            overallDiscountValue: 0,
            overallDiscountTypeId: DISCOUNT_TYPES.NONE,
            overallDiscountReasonId: '',
            overallDiscountReasonName: '',
            overallDiscountReasonRemark: '',
            netTotal: 0,
            overallTax: 0,
            totalLineTax: 0,
            totalTax: 0,
            grandTotal: 0,
            cashBalance: 0,
            shortfall: 0,
            remainingPaymentAmount: 0,
            cashBalanceException: '',
            isRecevedAmountTouched: false
        };
        state.isMultiPayment = null;
        state.paymentList = [];
        state.customer = null;
    },    
        increaseQty: (state, action) => {
            const { orderListId, increment } = action.payload;
            const order = state.list.find(order => order.orderListId === orderListId);
            if (order) {
                const incrementDecimal = new Decimal(increment);
                let qty = new Decimal(order.qty);
                qty = qty.plus(incrementDecimal);

                const unitPrice = new Decimal(order.unitPrice);
                const lineTaxAmount = new Decimal(order.lineTaxAmount);

                order.qty = qty.toNumber();
                order.grossAmount = unitPrice.times(qty).toNumber();
                order.netAmount = unitPrice.times(qty).plus(lineTaxAmount).toNumber();
            }
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },

        decreaseQty: (state, action) => {
            const { orderListId, decrement } = action.payload;
            const order = state.list.find(order => order.orderListId === orderListId);
            if (order) {
                const decrementDecimal = new Decimal(decrement);
                let qty = new Decimal(order.qty);

                qty = qty.minus(decrementDecimal);
                if (qty.lessThan(1)) qty = new Decimal(1);

                const unitPrice = new Decimal(order.unitPrice);
                const lineTaxAmount = new Decimal(order.lineTaxAmount);

                order.qty = qty.toNumber();
                order.grossAmount = unitPrice.times(qty).toNumber();
                order.netAmount = unitPrice.times(qty).plus(lineTaxAmount).toNumber();
            }
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },
     
        addOrder: (state, action) => {
            const unitPrice = new Decimal(action.payload.unitPrice);
            const qty = new Decimal(action.payload.qty);
            const lineTaxRate = new Decimal(action.payload.lineTaxRate || 0); 
          //  const discountAmount = new Decimal(0); // Assuming discountAmount starts as 0
            
            const grossAmount = unitPrice.times(qty);
            const lineTaxAmount = grossAmount.times(lineTaxRate.dividedBy(100)); // Calculate line tax

           // const netAmount = grossAmount;//.minus(discountAmount);
            
           console.log('action.payload',action.payload)
            const newOrder = {
                orderListId: state.nextOrderListId,
                ...action.payload,
                grossAmount: grossAmount.toNumber(),
               // netAmount: netAmount.toNumber(),
              // discountAmount: discountAmount.toNumber(), // Initially 0, change as needed
              lineTaxAmount: lineTaxAmount.toNumber(),
              netAmount: grossAmount.plus(lineTaxAmount).toNumber()
            };

            state.nextOrderListId += 1;

            const existingOrderIndex = state.list.findIndex(order => order.productId === newOrder.productId);

            if (existingOrderIndex !== -1) {
                const existingOrder = state.list[existingOrderIndex];
                const existingQty = new Decimal(existingOrder.qty);
                const updatedQty = existingQty.plus(qty);
               
                const updatedGrossAmount = unitPrice.times(updatedQty);
                const updatedLineTaxAmount = updatedGrossAmount.times(lineTaxRate.dividedBy(100));
                const updatedNetAmount = updatedGrossAmount.plus(updatedLineTaxAmount);//.minus(existingOrder.discountAmount * updatedQty);

                existingOrder.qty = updatedQty.toNumber();
                existingOrder.grossAmount = updatedGrossAmount.toNumber();
                existingOrder.lineTaxAmount= updatedLineTaxAmount.toNumber();
                existingOrder.netAmount = updatedNetAmount.toNumber();
            } else {
                state.list.push(newOrder);
            }
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },

        removeOrder: (state, action) => {
            const { orderListId } = action.payload; 
            console.log('remove order',orderListId)
            state.list = state.list.filter(order => order.orderListId !== orderListId);
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },
        applyDiscount: (state, action) => {

            const { orderListId,discount} = action.payload;
            const { discountValue, discountTypeId ,reasonId,reasonName,reasonRemark }=discount;
            const order = state.list.find(order => order.orderListId === orderListId);
            console.log('applyDiscountr',order)
            if (!order) return; // Ensure order exists

            const grossAmount = new Decimal(order.grossAmount);
            let discountValueDecimal = new Decimal(discountValue || 0);
            // Ensure that the discountValue is not negative. If it is, set it to 0.
            if (discountValueDecimal.isNegative()) {
                console.warn("Discount value cannot be negative. Ignoring discount application.");
                return; // Stop further execution if discount is negative
            }

            let discountAmount;

            // Calculate discount based on type
            if (discountTypeId  === DISCOUNT_TYPES.PERCENTAGE) {
                // Ensure the percentage is not greater than 100
              //  if (discountValueDecimal.greaterThan(100)) discountValueDecimal = new Decimal(100);
                discountAmount = grossAmount.times(discountValueDecimal.dividedBy(100));
            } else if (discountTypeId  === DISCOUNT_TYPES.FIXED_AMOUNT) {
                // Ensure discount does not exceed the gross amount
               // if (discountValueDecimal.greaterThan(grossAmount)) discountValueDecimal = grossAmount;
                discountAmount = discountValueDecimal;
            } else {
                // If discountType is not recognized, log an error and return
                console.error(`Unrecognized discount type: ${discountTypeId}`);
                return;
            }

            // Update order with new discount details
            order.netAmount = grossAmount.minus(discountAmount).toNumber();
            order.discount={
                discountValue :discountValueDecimal.toNumber(),
                discountTypeId:discountTypeId,
                reasonId,
                reasonName,
                reasonRemark,
               // discountReason: discountReason,
                discountAmount: discountAmount.toNumber()
            }
           
            orderListSlice.caseReducers.calculateOrderSummary(state);

            console.log('Discount applied. New net amount:', order.netAmount);
        },
        cancelDiscount: (state, action) => {
            const { orderListId } = action.payload;
            const order = state.list.find(order => order.orderListId === orderListId);
            if (order) { // Check if the order exists
                // Use Decimal for precise arithmetic operations
                const qty = new Decimal(order.qty);
                const unitPrice = new Decimal(order.unitPrice);

                // Recalculate gross and net amounts without discount
                const grossAmount = unitPrice.times(qty);
                const netAmount = grossAmount; // Since discount is canceled, net is same as gross

                // Resetting discount related properties
                order.grossAmount = grossAmount.toNumber();
                order.netAmount = netAmount.toNumber();
                order.discount=undefined;
              //  order.discount.discountTypeId = 0;
               // order.discount.discountAmount = 0;
               // order.discount.discountReason=null;
            }
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },
        setTaxRate: (state, action) => {
            state.overallTaxRate = action.payload;
        },
        calculateOrderSummary: (state) => {
          let subtotal = 0;
          let totalLineDiscounts = 0;
          let totalDiscounts = 0;
          let totalLineTaxAmount = 0.00;
      
          state.list.forEach(order => {
              let unitPrice = order.unitPrice;
              let qty = order.qty;
      
              const lineTaxAmount = order.lineTaxAmount;
      
              let discountAmount = 0;
              if (order.discount) {
                  discountAmount = order.discount.discountAmount;
              }
      
              subtotal += unitPrice * qty;
              totalLineDiscounts += discountAmount * qty;
              totalLineTaxAmount += lineTaxAmount;
          });
      
          let netTotal = subtotal - totalLineDiscounts;
      
          let overallDiscountAmount = state.orderSummary.overallDiscountValue || 0;
          if (state.orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE) {
              overallDiscountAmount = netTotal * (overallDiscountAmount / 100);
          }
      
          netTotal -= overallDiscountAmount;
      
          totalDiscounts = totalLineDiscounts + overallDiscountAmount;
      
          //let overallTaxAmount = netTotal * (overallTaxRate / 100);
          let grandTotal = netTotal  + totalLineTaxAmount;
      
          state.orderSummary.subtotal = subtotal;
          state.orderSummary.lineDiscounts = totalLineDiscounts;
          state.orderSummary.overallDiscounts = overallDiscountAmount;
          state.orderSummary.discounts = totalDiscounts;
          state.orderSummary.netTotal = netTotal;
          //state.orderSummary.overallTax = overallTaxAmount;
          state.orderSummary.totalLineTax = totalLineTaxAmount;
          state.orderSummary.totalTax = totalLineTaxAmount;
          state.orderSummary.grandTotal = grandTotal.toFixed(2);
      },    
        applyOverallDiscount: (state, action) => {
            const { discountValue, discountTypeId,reasonId,reasonName,reasonRemark  } = action.payload;
            state.orderSummary.overallDiscountValue = discountValue;
            state.orderSummary.overallDiscountTypeId = discountTypeId;
            state.orderSummary.overallDiscountReasonId = reasonId;
            state.orderSummary.overallDiscountReasonName = reasonName;
            state.orderSummary.overallDiscountReasonRemark = reasonRemark;
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },
        cancelOverallDiscount: (state) => {
            state.orderSummary.overallDiscountValue = 0;
            state.orderSummary.overallDiscountTypeId = DISCOUNT_TYPES.NONE;
            state.orderSummary.overallDiscountReasonName = null;
            orderListSlice.caseReducers.calculateOrderSummary(state);
        },
        removePayment: (state, action) => {
            const {id} = action.payload;
            state.paymentList = state.paymentList.filter(payment => payment.id !== id);
          },

          addSinglePayment: (state, action) => {
            
            const { paymentData } = action.payload;
            const { methodId, amountPaid, cardPayment, cashPayment } =paymentData;

            if(state.isMultiPayment===true){
                orderListSlice.caseReducers.clearPayment(state);
            }
            console.log('cashhh',action.payload)
            state.isMultiPayment=false;
        
              if (methodId === PAYMENT_METHODS.CARD) {
                const {
                  cardHolderName,
                  bankId,
                  cardTypeId,
                  cardLastFourDigits,
                  cardExpirationMonth,
                  cardExpirationYear,
                } = cardPayment;

                const cardPaymentDetail = {
                    id: 1,
                  methodId,
                  amountPaid,
                  cardPayment:{
                    cardHolderName,
                    bankId,
                    cardTypeId,
                    cardLastFourDigits,
                    cardExpirationMonth,
                    cardExpirationYear,
                  }
            
                };
                state.paymentList=[cardPaymentDetail];
              }
           
              if (methodId === PAYMENT_METHODS.CASH) {

                const { receivedAmount, balanceAmount } = cashPayment;
                const cashPaymentDetail = {
                    id: 1,
                  methodId,
                  amountPaid,
                  cashPayment:{
                    // receivedAmount,
                    // balanceAmount,
                  }
           
                };
                state.paymentList=[cashPaymentDetail];
              }
            
          },

   
        addMultiPayment: (state, action) => {
          //state.orderSummary.cashBalance=0;
          const { paymentData } = action.payload;
          const { methodId, amountPaid, cardPayment, cashPayment } =
            paymentData;

          if (state.isMultiPayment === false) {
            orderListSlice.caseReducers.clearPayment(state);
          }

          console.log("Payment data:", action.payload);
          state.isMultiPayment = true;

          if (methodId === PAYMENT_METHODS.CARD) {
            const {
              cardHolderName,
              bankId,
              cardTypeId,
              cardLastFourDigits,
              cardExpirationMonth,
              cardExpirationYear,
            } = cardPayment;

            const newPaymentId =
              state.paymentList.reduce(
                (max, payment) => Math.max(max, payment.id),
                0
              ) + 1;

            const cardPaymentDetail = {
              id: newPaymentId,
              methodId,
              amountPaid,
              cardPayment: {
                cardHolderName,
                bankId,
                cardTypeId,
                cardLastFourDigits,
                cardExpirationMonth,
                cardExpirationYear,
              },
            };

            state.paymentList.push(cardPaymentDetail);
          }

          if (methodId === PAYMENT_METHODS.CASH) {
            let existingCashPaymentIndex = state.paymentList.findIndex(
              (p) => p.methodId === PAYMENT_METHODS.CASH
            );

            if (existingCashPaymentIndex >= 0) {

              const amountPaid_decimal = new Decimal(
                state.paymentList[existingCashPaymentIndex].amountPaid
              );
              state.paymentList[existingCashPaymentIndex].amountPaid =
                amountPaid_decimal.plus(amountPaid).toNumber();
              // state.paymentList[existingCashPaymentIndex].cashPayment.receivedAmount += receivedAmount;

              //state.paymentList[existingCashPaymentIndex].cashPayment.balanceAmount = balanceAmount;
            } else {

              const newPaymentId =
                state.paymentList.reduce(
                  (max, payment) => Math.max(max, payment.id),
                  0
                ) + 1;
              const cashPaymentDetail = {
                id: newPaymentId,
                methodId,
                amountPaid,
                cashPayment: {
                  // receivedAmount,
                  // balanceAmount,
                },
              };

              state.paymentList.push(cashPaymentDetail);
            }

            //existingCashPaymentIndex = state.paymentList.findIndex(p => p.methodId === PAYMENT_METHODS.CASH);

            //  const totalPaidAlready = state.paymentList.reduce((sum, payment) => sum + payment.amountPaid, 0);
            //  // Calculate the remaining payment amount before adding the new payment
            //  let remainingPaymentAmount = state.orderSummary.grandTotal - totalPaidAlready;

            //  state.paymentList[existingCashPaymentIndex].amountPaid =
            //  (state.paymentList[existingCashPaymentIndex].cashPayment.receivedAmount > state.orderSummary.grandTotal ?
            //     state.orderSummary.grandTotal :
            //      state.paymentList[existingCashPaymentIndex].cashPayment.receivedAmount);
            // state.orderSummary.cashBalance= (state.paymentList[existingCashPaymentIndex].cashPayment.receivedAmount > state.orderSummary.grandTotal ?   state.paymentList[existingCashPaymentIndex].cashPayment.receivedAmount-state.orderSummary.grandTotal : 0) ;
          }

          const cardPayments = state.paymentList.filter(
            (f) => f.methodId === PAYMENT_METHODS.CARD
          );
          const cashPayments = state.paymentList.filter(
            (f) => f.methodId === PAYMENT_METHODS.CASH
          );

          // const cardAmountPaid = cardPayments.length > 0 ? cardPayments[0].amountPaid : 0;
          // const cashAmountPaid = cashPayments.length > 0 ? cashPayments[0].amountPaid : 0;

          const totalCardAmountPaid = cardPayments.reduce(
            (sum, payment) => sum + payment.amountPaid,
            0
          );
          const totalCashAmountPaid = cashPayments.reduce(
            (sum, payment) => sum + payment.amountPaid,
            0
          );

          // console.log('Total Card Amount Paid:', totalCardAmountPaid);
          // console.log('Total Cash Amount Paid:', totalCashAmountPaid);
    
          orderListSlice.caseReducers.calculateBalance(state, {
            payload: {
              receivedAmountCard: totalCardAmountPaid, // The total amount paid by card
              receivedAmountCash: totalCashAmountPaid, // The total amount paid by cash
              isRecevedAmountTouched: true, // Additional flag as per your logic
            }
          });
        },        
        clearPayment:(state,action)=>{
            state.paymentList=[];
          },
          setMultiPayment: (state, action) => {
            state.isMultiPayment = action.payload;
        },

        calculateBalance: (state, action) => {
            const grandTotal = new Decimal(state.orderSummary.grandTotal);
            console.log(' grandTotal reduceer',grandTotal.toNumber())
            const receivedAmountCash = new Decimal(action.payload.receivedAmountCash || 0);
            const receivedAmountCard = new Decimal(action.payload.receivedAmountCard || 0);
            let errorMessage = "";
            let balanceAmount = new Decimal(0); 
            console.log(' receivedAmountCash reduceer',receivedAmountCash.toNumber())

        
            if (receivedAmountCard.plus(receivedAmountCash).lessThan(grandTotal)) {
                const shortfall = grandTotal.minus(receivedAmountCard.plus(receivedAmountCash));
                state.orderSummary.shortfall=shortfall.toNumber();
                errorMessage = `Insufficient payment. An additional [currency] ${shortfall} is needed`;
                state.orderSummary.cashBalance = 0;
            } else if (receivedAmountCard.greaterThan(grandTotal)) {
                state.orderSummary.cashBalance = 0;
                state.orderSummary.shortfall='';
                errorMessage = 'Overpayment. Card payment exceeds the total amount.'+'grnd:'+ grandTotal.toNumber()+', rec Am:'+receivedAmountCard.toNumber();
            } else if (receivedAmountCash.greaterThan(grandTotal.minus(receivedAmountCard))) {
                console.log('calculae blance reduceer',balanceAmount.toNumber())
                balanceAmount = receivedAmountCard.plus(receivedAmountCash).minus(grandTotal);
                state.orderSummary.cashBalance = balanceAmount.toNumber();
                state.orderSummary.shortfall='';
            }
      
            state.orderSummary.cashBalanceException = errorMessage;
          
            state.orderSummary.isRecevedAmountTouched = action.payload.isRecevedAmountTouched;
            console.log('errorMessage:',errorMessage)
        },
        
      

        updateCashPayment: (state, action) => {
            const { id, receivedAmount, balanceAmount } = action.payload;
            const cashPaymentIndex = state.paymentList.findIndex(p => p.id === id);
      
            if (cashPaymentIndex !== -1) {

              state.paymentList[cashPaymentIndex].cashPayment.receivedAmount = receivedAmount;
            }
          },

          addReturnedProduct:(state,action)=>{
            const {returnedProducts,orderNo}=action.payload.returnedProducts;
       
            console.log('returnedProducts',returnedProducts)

            returnedProducts.forEach(e=>{
              
              const newOrder = {
                orderListId: e.orderDetailId,
               
                description:`${ orderNo} ${e.productNo} ${e.productName}`,
                lineTaxRate:0,
                productId:e.productId,
                productNo:e.productName,
                qty:e.returnQty>0 && -1*e.returnQty,
                unitPrice:e.unitPrice,
  
                grossAmount: e.grossAmount,
               // netAmount: netAmount.toNumber(),
              // discountAmount: discountAmount.toNumber(), // Initially 0, change as needed
              lineTaxAmount: 0, // Add line tax
              netAmount:parseFloat(e.netAmount),
              returnItem:{isReturned:true,orderDetailId:e.orderDetailId}
            };
  
              state.list.push(newOrder);



            })
         
          }
    }
});

export const { addOrder, increaseQty, decreaseQty,removeOrder,applyDiscount ,cancelDiscount,calculateOrderSummary,applyOverallDiscount,cancelOverallDiscount,
    addMultiPayment,addSinglePayment,clearPayment,removePayment,setMultiPayment,calculateBalance,clearOrderList,setCustomer,
    addReturnedProduct} = orderListSlice.actions;

export default orderListSlice.reducer;
