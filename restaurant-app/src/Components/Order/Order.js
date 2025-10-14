import React from 'react'
import OrderForm from './OrderForm'


import useForm from '../../hooks/useForm'
const generateOrderNumber=()=>Math.floor(100000 + Math.random() * 900000);
  

const getFreshModelObject=()=>({
"orderMasterId":0,
"orderNumber":generateOrderNumber(),
"customerId":'',
"pMethod":'',
"deletedOrderItemIds":"",
"grandTotal":[],
})


function Order() {
   const {  values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls
}=useForm(getFreshModelObject)
  
  return (
    <div>
    <OrderForm
    {...{values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls
    }}
    />
    </div>
  )
}

export default Order