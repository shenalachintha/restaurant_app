import React, { useState, useEffect } from 'react'
import Form from "../../layouts/Form";
import { Grid, InputAdornment, ButtonGroup, Button as MuiButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Input, Select, Button } from "../../controls";
import ReplayIcon from '@mui/icons-material/Replay';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReorderIcon from '@mui/icons-material/Reorder';
import { createAPIEndpoint, ENDPIONTS } from "../../Api";
import { roundTo2DecimalPoint } from "../../utils";
import Popup from '../../layouts/Popup';
import OrderList from './OrderList';
import Notification from "../../layouts/Notification";
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';

const pMethods = [
    { id: 'none', title: 'Select' },
    { id: 'Cash', title: 'Cash' },
    { id: 'Card', title: 'Card' },
]

const useStyles = makeStyles(() => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        }
    },
    submitButtonGroup: {
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: 8,
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))

export default function OrderForm(props) {

    const { values, setValues, errors, setErrors,
        handleInputChange, resetFormControls } = props;
    const classes = useStyles();

    const [customerList, setCustomerList] = useState([]);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [recentOrder, setRecentOrder] = useState(null);
    const [localOrders, setLocalOrders] = useState([]);
    const [orderId, setOrderId] = useState(0);
    const [notify, setNotify] = useState({ isOpen: false })

    useEffect(() => {
        createAPIEndpoint(ENDPIONTS.CUSTOMER).fetchAll()
            .then(res => {
                let customerList = res.data.map(item => ({
                    id: item.customerId,
                    title: item.customerName
                }));
                customerList = [{ id: 0, title: 'Select' }].concat(customerList);
                setCustomerList(customerList);
            })
            .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        let gTotal = values.orderDetails.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.foodItemPrice);
        }, 0);
        setValues({
            ...values,
            gTotal: roundTo2DecimalPoint(gTotal)
        })

    }, [JSON.stringify(values.orderDetails)]);

    useEffect(() => {
        if (orderId == 0) resetFormControls()
        else {
            createAPIEndpoint(ENDPIONTS.ORDER).fetchById(orderId)
                .then(res => {
                    setValues(res.data);
                    setErrors({});
                })
                .catch(err => console.log(err))
        }
    }, [orderId]);

    const validateForm = () => {
        let temp = {};
        temp.customerId = values.customerId != 0 ? "" : "This field is required.";
        temp.pMethod = values.pMethod != "none" ? "" : "This field is required.";
        temp.orderDetails = values.orderDetails.length != 0 ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const resetForm = () => {
        resetFormControls();
        setOrderId(0);
    }

    const submitOrder = e => {
        e.preventDefault();
        if (validateForm()) {
            if (values.orderMasterId == 0) {
                createAPIEndpoint(ENDPIONTS.ORDER).create(values)
                    .then(res => {
                        // keep a deep-cloned snapshot of the created order so resetFormControls
                        // does not clear the details (values is mutated by resetFormControls)
                        const snapshot = JSON.parse(JSON.stringify(res.data || values));
                        // ensure snapshot has customer object for display in OrderList
                        if (!snapshot.customer) {
                            const cust = customerList.find(c => c.id === snapshot.customerId);
                            snapshot.customer = { customerName: cust ? cust.title : '' };
                        }
                        // ensure an id exists for list deduping (server should provide one)
                        if (!snapshot.orderMasterId) snapshot.orderMasterId = Date.now();
                        console.log('Created order snapshot:', snapshot);
                        setRecentOrder(snapshot);
                        // keep a local copy so the Orders list shows immediately
                        setLocalOrders(prev => [snapshot, ...prev]);
                        // auto-open Orders so user can immediately see submitted items
                        setOrderListVisibility(true);
                        resetFormControls();
                        setNotify({isOpen:true, message:'New order is created.'});
                    })
                    .catch(err => console.log(err));
            }
            else {
                createAPIEndpoint(ENDPIONTS.ORDER).update(values.orderMasterId, values)
                    .then(res => {
                        // store deep-cloned snapshot of updated order
                        const snapshot = JSON.parse(JSON.stringify(res.data || values));
                        if (!snapshot.customer) {
                            const cust = customerList.find(c => c.id === snapshot.customerId);
                            snapshot.customer = { customerName: cust ? cust.title : '' };
                        }
                        if (!snapshot.orderMasterId) snapshot.orderMasterId = Date.now();
                        console.log('Updated order snapshot:', snapshot);
                        setRecentOrder(snapshot);
                        setLocalOrders(prev => {
                            // replace existing local order with same id or prepend
                            const without = prev.filter(o => o.orderMasterId !== snapshot.orderMasterId);
                            return [snapshot, ...without];
                        });
                        // auto-open Orders to show updated details
                        setOrderListVisibility(true);
                        setOrderId(0);
                        setNotify({isOpen:true, message:'The order is updated.'});
                    })
                    .catch(err => console.log(err));
            }
        }

    }

    const openListOfOrders = () => {
        // If there's no recentOrder (e.g. server didn't return nested details),
        // use a snapshot of current values so the popup shows selected items.
        if (!recentOrder || !recentOrder.orderDetails || recentOrder.orderDetails.length === 0) {
            const snapshot = JSON.parse(JSON.stringify(values));
            setRecentOrder(snapshot);
        }
        setOrderListVisibility(true);
    }

    return (
        <>
            <Form onSubmit={submitOrder}>
                <Grid container>
                    <Grid item xs={6}>
                        <Input
                            disabled
                            label="Order Number"
                            name="orderNumber"
                            value={values.orderNumber}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">#</InputAdornment>
                            }}
                        />
                        <Select
                            label="Customer"
                            name="customerId"
                            value={values.customerId}
                            onChange={handleInputChange}
                            options={customerList}
                            error={errors.customerId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            label="Payment Method"
                            name="pMethod"
                            value={values.pMethod}
                            onChange={handleInputChange}
                            options={pMethods}
                            error={errors.pMethod}
                        />
                        <Input
                            disabled
                            label="Grand Total"
                            name="gTotal"
                            value={values.gTotal}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">$</InputAdornment>
                            }}
                        />
                        <ButtonGroup className={classes.submitButtonGroup}>
                            <MuiButton
                                size="large"
                                endIcon={<RestaurantMenuIcon />}
                                type="submit">Submit</MuiButton>
                            <MuiButton
                                size="small"
                                onClick={resetForm}
                                startIcon={<ReplayIcon />}
                            />
                        </ButtonGroup>
                        <Button
                            size="large"
                            onClick={openListOfOrders}
                            startIcon={<ReorderIcon />}
                        >Orders</Button>
                    </Grid>
                </Grid>
            </Form>
            {/* Local submitted orders (client-side) - visible so you can confirm submissions */}
            {localOrders && localOrders.length > 0 && (
                <Paper style={{ marginTop: 16, padding: 8 }}>
                    <Typography variant="subtitle1">Local submitted orders</Typography>
                    <List>
                        {localOrders.map((o, i) => (
                            <ListItem key={i}>
                                <ListItemText
                                    primary={o.orderNumber || ('#' + o.orderMasterId)}
                                    secondary={o.customer && o.customer.customerName ? o.customer.customerName : (o.customerName || '')}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
            <Popup
                title="List of Orders"
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}>
                <OrderList
                    {...{ setOrderId, setOrderListVisibility, resetFormControls, setNotify }}
                    recentOrder={recentOrder}
                    customerList={customerList}
                    localOrders={localOrders}
                    open={orderListVisibility} />
            </Popup>
            <Notification
                {...{ notify, setNotify }} />
        </>
    )
}