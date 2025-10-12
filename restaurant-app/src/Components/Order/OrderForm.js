import React from 'react'
import Form from '../../layouts/Form'
import { Grid } from '@mui/material'
import Input from '../../controls/input'
import Select from '../../controls/select'
import { useForm } from '../../hooks/useForm'



const generateOrderNumber=()=>Math.floor(100000 + Math.random() * 900000);
  

const getFreshModelObject=()=>({
"orderMasterId":0,
"orderNumber":generateOrderNumber(),
"customerId":'',
"pMethod":'',
"deletedOrderItemIds":"",
"grandTotal":[],
})

const pMethods=[
  {id:'cash', title:'Cash'},
  {id:'card', title:'Card'},
  {id:'upi', title:'UPI'},
]
function OrderForm() {
  
  useForm(getFreshModelObject)
  

  return (
    <Form>
        <Grid container>
            <Grid item xs={6} >
                <Input 
                disabled
                name="order number"
                 label="Order Number" 
               
                  value={values.orderNumber}
                 />
                 <Select
                  name='customer id'
                  label='Customer'
                    onChange={handleInputChange}
                  options={[
                    {id:'1', title:'Customer 1'},
                    {id:'2', title:'Customer 2'},
                    {id:'3', title:'Customer 3'},
                  ]}
                 />
               
            </Grid>
            <Grid item xs={6}>
              <Select
              name='pmethod'
              label='Payment Method'
              value={values.pMethod}
              options={pMethods}
              onChange={handleInputChange}
              />
             <Input
             name='grand total'
              label='Grand Total'
              value={values.grandTotal}
            
              />
            </Grid>
        </Grid>

    </Form>
  )
}

export default OrderForm