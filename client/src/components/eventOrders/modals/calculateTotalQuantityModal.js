import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const CalculateTotalQuantity = (props) => {
    const {
        buttonLabel,
        className,
        totalItems,
        getSelectedOrders,
        eventDate,
        eventName,
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    useEffect(() => {
        if (modal) {
            getSelectedOrders()
        }
    }, [modal])

    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#dbc268', color: 'black', fontSize: '22px' }}
                onClick={toggle}
            >
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="sm">
                <DialogTitle style={{ backgroundColor: '#ebc642', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        Total Item Requirements<br />
                        Event Name - {eventName}<br />
                        Event Date - {eventDate}
                    </div>
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#fff5d2', padding: '20px' }}>
                    <table>
                        <thead>
                            <tr>
                                <td>ITEM</td>
                                <td>TOTAL QUANTITY</td>
                            </tr>
                        </thead>
                        <tbody>
                            {totalItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td style={{ textAlign: 'center' }}>{item.quantity} {item.measured}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '320px' }}>
                    <button style={{ backgroundColor: '#ebc642' }} onClick={toggle}>OK</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CalculateTotalQuantity;
