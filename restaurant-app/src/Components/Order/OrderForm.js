import React from 'react'
import Form from '../../layouts/Form'
import { Grid } from '@mui/material'

function OrderForm() {
  return (
    <Form>
        <Grid container>
            <Grid item xs={12} sm={6}>
                Name
            </Grid>
            <Grid item xs={12} sm={6}>
                Address
            </Grid>
        </Grid>

    </Form>
  )
}

export default OrderForm