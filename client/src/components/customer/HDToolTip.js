import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const HDToolTip = () => (
    <Tooltip
        title="Doorstep delivery provided from our side"
        placement="right"
        arrow
        slotProps={{
            tooltip: {
                sx: {
                    bgcolor: '#1a1800',
                    color: 'rgba(255,255,255,0.87)',
                    border: '1px solid rgba(201,162,39,0.35)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    px: 1.5,
                    py: 0.75,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    maxWidth: 220,
                },
            },
            arrow: { sx: { color: '#1a1800' } },
        }}
    >
        <InfoOutlinedIcon
            sx={{
                fontSize: '1rem',
                color: 'rgba(201,162,39,0.6)',
                cursor: 'pointer',
                verticalAlign: 'middle',
                '&:hover': { color: '#C9A227' },
                transition: 'color 0.15s',
            }}
        />
    </Tooltip>
)

export default HDToolTip
