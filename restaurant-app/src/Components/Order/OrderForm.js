import React,{useState,useEffect, use} from 'react'
import Form from '../../layouts/Form'
import { ButtonGroup, Grid } from '@mui/material'
import Input from '../../controls/input'
import Select from '../../controls/select'
import InputAdornment from '@mui/material/InputAdornment';
import MuiButton from '../../controls/button'
import ReplayIcon from '@mui/icons-material/Replay';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Button from '../../controls/button'
import ReorderIcon from '@mui/icons-material/Reorder';
import { CreateAPIEndpoint } from '../../Api'
import { ENDPIONTS } from '../../Api'








const pMethods=[
  {id:'cash', title:'Cash'},
  {id:'card', title:'Card'},
  {id:'upi', title:'UPI'},
]
function OrderForm(props) {
  const {values,
        handleInputChange,       
}=props;  
  const [customerList, setCustomerList] = useState([]);
    // const classes=useStyles(); // Removed unused useStyles
    useEffect(() => {
        CreateAPIEndpoint(ENDPIONTS.CUSTOMER).fetchAll()
            .then(res => {
                let customerList = res.data.map(item => ({
                    id: item.customerID,
                    title: item.customerName
                }));
                customerList = [{ id: 0, title: 'Select' }].concat(customerList);
                setCustomerList(customerList);
            })
            .catch(err => console.log(err))
    }, [])

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
                         sx={{ color: '#aeba31ff', fontWeight: 'bold', fontSize: '1.5rem' }}
                     >#</InputAdornment>
                  }}
                 />
                 <Select
                  name='customer id'
                  label='Customer'
                    onChange={handleInputChange}
                  options={[
                    ...customerList
                  ]}
                 />
               
            </Grid>
            <Grid item xs={6}>
              <Select
                  name='pmethod' // Fixed typo in prop name
              label='Payment Method'
                  value={values.pMethod} // Removed extra 'y'
              
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
              <ButtonGroup sx={{ gap: 1, '& .MuiButton-root': { textTransform: 'none' } }}>
                <MuiButton
                  size="large"
                  type="submit"
                  endIcon={<RestaurantMenuIcon />}
                  sx={{
                    color: '#fff',
                    bgcolor: '#1976d2',
                    '&:hover': { bgcolor: '#115293' },
                    '& .MuiButton-startIcon, & .MuiButton-endIcon': { color: 'inherit' }
                  }}
                >
                  Submit
                </MuiButton>
                <MuiButton
                  size="small"
                  startIcon={<ReplayIcon />}
                  sx={{
                    color: '#fff',
                    bgcolor: '#9c27b0',
                    '&:hover': { bgcolor: '#6d1b7b' },
                    '& .MuiButton-startIcon': { color: 'inherit' }
                  }}
                />
              </ButtonGroup>
              <Button
              size='large'
              startIcon={<ReorderIcon/>}
              >
                Orders
              </Button>
            </Grid>
        </Grid>

    </Form>
  )
}

export default OrderForm