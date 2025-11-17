import React, { useState, useEffect, useRef } from 'react'
import { Button, Box } from '@mui/material';
import { createAPIEndpoint, ENDPIONTS } from "../../Api";
import Table from "../../layouts/Table";
import { TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

export default function OrderList(props) {

    const { setOrderId, setOrderListVisibility, resetFormControls, setNotify, recentOrder, customerList, localOrders, open } = props;

    const [orderList, setOrderList] = useState([]);

    console.log('OrderList props.recentOrder:', recentOrder);
    console.log('OrderList state.orderList:', orderList);

    useEffect(() => {
        createAPIEndpoint(ENDPIONTS.ORDER).fetchAll()
            .then(res => {
                let fetched = res.data || [];

                // Prepend any localOrders (client-side newly created orders) so they appear immediately
                if (localOrders && localOrders.length > 0) {
                    // Map localOrders to server shape if necessary and avoid duplicates
                    const mappedLocal = localOrders.map(lo => ({
                        orderMasterId: lo.orderMasterId,
                        orderNumber: lo.orderNumber || ('#' + lo.orderMasterId),
                        customer: lo.customer || (customerList ? { customerName: (customerList.find(c => c.id === lo.customerId) || {}).title } : { customerName: '' }),
                        pMethod: lo.pMethod || '',
                        gTotal: lo.gTotal || 0,
                        orderDetails: lo.orderDetails || []
                    }));

                    // remove any fetched items with same id, then prepend local ones
                    const fetchedWithoutLocal = fetched.filter(f => !mappedLocal.some(m => m.orderMasterId === f.orderMasterId));
                    fetched = [...mappedLocal, ...fetchedWithoutLocal];
                }

                // If recentOrder looks like a full order (has orderNumber/orderMasterId),
                // prepend it so newly created/updated orders appear immediately.
                if (recentOrder && (recentOrder.orderNumber || recentOrder.orderMasterId)) {
                    const alreadyPresent = fetched.some(o => o.orderMasterId === recentOrder.orderMasterId);
                    if (!alreadyPresent) {
                        const mapped = {
                            orderMasterId: recentOrder.orderMasterId,
                            orderNumber: recentOrder.orderNumber || ('#' + recentOrder.orderMasterId),
                            customer: recentOrder.customer || (customerList ? { customerName: (customerList.find(c => c.id === recentOrder.customerId) || {}).title } : { customerName: '' }),
                            pMethod: recentOrder.pMethod || '',
                            gTotal: recentOrder.gTotal || 0,
                            orderDetails: recentOrder.orderDetails || []
                        };
                        fetched = [mapped, ...fetched];
                    }
                }

                setOrderList(fetched)
            })
            .catch(err => console.log(err))
    }, [recentOrder, customerList, localOrders])

    // Poll while popup is open so other users' submissions appear
    const pollingRef = useRef(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    useEffect(() => {
        if (!open) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        // start polling: fetch immediately and then every 3 seconds
        const fetchAndSet = () => {
            createAPIEndpoint(ENDPIONTS.ORDER).fetchAll()
                .then(res => {
                    let fetched = res.data || [];

                    if (localOrders && localOrders.length > 0) {
                        const mappedLocal = localOrders.map(lo => ({
                            orderMasterId: lo.orderMasterId,
                            orderNumber: lo.orderNumber || ('#' + lo.orderMasterId),
                            customer: lo.customer || (customerList ? { customerName: (customerList.find(c => c.id === lo.customerId) || {}).title } : { customerName: '' }),
                            pMethod: lo.pMethod || '',
                            gTotal: lo.gTotal || 0,
                            orderDetails: lo.orderDetails || []
                        }));
                        const fetchedWithoutLocal = fetched.filter(f => !mappedLocal.some(m => m.orderMasterId === f.orderMasterId));
                        fetched = [...mappedLocal, ...fetchedWithoutLocal];
                    }

                    if (recentOrder && (recentOrder.orderNumber || recentOrder.orderMasterId)) {
                        const alreadyPresent = fetched.some(o => o.orderMasterId === recentOrder.orderMasterId);
                        if (!alreadyPresent) {
                            const mapped = {
                                orderMasterId: recentOrder.orderMasterId,
                                orderNumber: recentOrder.orderNumber || ('#' + recentOrder.orderMasterId),
                                customer: recentOrder.customer || (customerList ? { customerName: (customerList.find(c => c.id === recentOrder.customerId) || {}).title } : { customerName: '' }),
                                pMethod: recentOrder.pMethod || '',
                                gTotal: recentOrder.gTotal || 0,
                                orderDetails: recentOrder.orderDetails || []
                            };
                            fetched = [mapped, ...fetched];
                        }
                    }

                    setOrderList(fetched);
                    setLastUpdated(new Date().toLocaleTimeString());
                })
                .catch(err => console.log(err));
        }

        fetchAndSet();
        pollingRef.current = setInterval(fetchAndSet, 3000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        }
    }, [open, recentOrder, customerList, localOrders]);

    const handleRefresh = () => {
        // manual refresh
        createAPIEndpoint(ENDPIONTS.ORDER).fetchAll()
            .then(res => {
                let fetched = res.data || [];
                if (localOrders && localOrders.length > 0) {
                    const mappedLocal = localOrders.map(lo => ({
                        orderMasterId: lo.orderMasterId,
                        orderNumber: lo.orderNumber || ('#' + lo.orderMasterId),
                        customer: lo.customer || (customerList ? { customerName: (customerList.find(c => c.id === lo.customerId) || {}).title } : { customerName: '' }),
                        pMethod: lo.pMethod || '',
                        gTotal: lo.gTotal || 0,
                        orderDetails: lo.orderDetails || []
                    }));
                    const fetchedWithoutLocal = fetched.filter(f => !mappedLocal.some(m => m.orderMasterId === f.orderMasterId));
                    fetched = [...mappedLocal, ...fetchedWithoutLocal];
                }
                setOrderList(fetched);
                setLastUpdated(new Date().toLocaleTimeString());
            })
            .catch(err => console.log(err));
    }

    // Ensure recentOrder is prepended to the displayed list as soon as it changes.
    useEffect(() => {
        if (!recentOrder) return;

        // If recentOrder looks like a full order, map it to the same shape and prepend
        if (recentOrder.orderDetails && (recentOrder.orderNumber || recentOrder.orderMasterId)) {
            const mapped = {
                orderMasterId: recentOrder.orderMasterId,
                orderNumber: recentOrder.orderNumber || ('#' + recentOrder.orderMasterId),
                customer: recentOrder.customer || (customerList ? { customerName: (customerList.find(c => c.id === recentOrder.customerId) || {}).title } : { customerName: '' }),
                pMethod: recentOrder.pMethod || '',
                gTotal: recentOrder.gTotal || 0,
                orderDetails: recentOrder.orderDetails || []
            };

            setOrderList(prev => {
                const withoutDup = prev.filter(o => o.orderMasterId !== mapped.orderMasterId);
                return [mapped, ...withoutDup];
            });
        }
    }, [recentOrder, customerList]);

    const showForUpdate = id => {
        setOrderId(id);
        setOrderListVisibility(false);
    }

    const deleteOrder = id => {
        if (window.confirm('Are you sure to delete this record?')) {
            createAPIEndpoint(ENDPIONTS.ORDER).delete(id)
                .then(res => {
                    setOrderListVisibility(false);
                    setOrderId(0);
                    resetFormControls();
                    setNotify({ isOpen: true, message: 'Deleted successfully.' });
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3}>
                            <strong>Orders</strong>
                        </TableCell>
                        <TableCell align="right">
                            <small style={{ color: '#666' }}>{lastUpdated ? `Last: ${lastUpdated}` : ''}</small>
                        </TableCell>
                        <TableCell align="right">
                            <Button size="small" onClick={handleRefresh}>Refresh</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Order No.</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Payed With</TableCell>
                        <TableCell>Grand Total</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {orderList.map(item => (
                        <TableRow key={item.orderMasterId}>
                            <TableCell
                                onClick={e => showForUpdate(item.orderMasterId)}>
                                {item.orderNumber}
                            </TableCell>
                            <TableCell
                                onClick={e => showForUpdate(item.orderMasterId)}>
                                {item.customer && item.customer.customerName}
                            </TableCell>
                            <TableCell
                                onClick={e => showForUpdate(item.orderMasterId)}>
                                {item.pMethod}
                            </TableCell>
                            <TableCell
                                onClick={e => showForUpdate(item.orderMasterId)}>
                                {item.gTotal}
                            </TableCell>
                            <TableCell>
                                <DeleteOutlineTwoToneIcon
                                    color="secondary"
                                    onClick={e => deleteOrder(item.orderMasterId)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}