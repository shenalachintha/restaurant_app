import React from 'react'
import MuiButton from '@mui/material/Button'

export default function Button(props) {
    const { children, color, variant, onClick, className, sx, ...other } = props

    return (
        <MuiButton
            sx={{ m: 1, textTransform: 'none', ...(sx || {}) }}
            className={className}
            variant={variant || 'contained'}
            color={color || 'primary'}
            onClick={onClick}
            {...other}
        >
            {children}
        </MuiButton>
    )
}