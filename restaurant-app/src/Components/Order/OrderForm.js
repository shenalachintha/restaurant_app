import React from 'react'
import Form from '../../layouts/Form'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Input from '../../controls/input'
import Select from '../../controls/select'
import InputAdornment from '@mui/material/InputAdornment';

const useStyles = makeStyles(theme => ({
    adornmentText:{
      '& .MuiInputAdornment-root':{
        color:'#aeba31ff',
        fontWeight:'bold',
        fontSize:'1.5rem'

    }
    },
}));






const pMethods=[
  {id:'cash', title:'Cash'},
  {id:'card', title:'Card'},
  {id:'upi', title:'UPI'},
]
function OrderForm(props) {
  const {values,
        handleInputChange,
        
}=props;  
const classes=useStyles();

  return (
    <Form>
        <Grid container>
            <Grid item xs={6} >
                <Input 
                disabled
                name="order number"
                 label="Order Number" 
               
                  value={values.orderNumber}
                  InputProps={{
                    startAdornment: <InputAdornment
                     position="start"
                      className={classes.adornmentText}
                     >#</InputAdornment>
                  }}
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
              value={values.pMethod}y
              
              options={pMethods}
              onChange={handleInputChange}
              />
              <Input
                disabled
                name='grand total'
                label='Grand Total'
                value={values.grandTotal}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
        </Grid>

    </Form>
  )
}

export default OrderForm