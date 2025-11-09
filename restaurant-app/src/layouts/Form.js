import React from 'react'
import Box from '@mui/material/Box'

export default function Form(props) {
    const { children, ...other } = props;

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
                '& .MuiFormControl-root': {
                    width: '90%',
                    m: 1
                }
            }}
            {...other}
        >
            {children}
        </Box>
    )
}