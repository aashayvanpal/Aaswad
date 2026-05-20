import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '../css/HomePage/check.css'
import cartImage from '../images/cart-image.svg'
import Cart from './Cart.js'
import AdminCart from './AdminCart.js'

const CartModel = (props) => {
    const {
        buttonLabel,
        className,
        resetIsSelected,
        requestOrder,
        userType,
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#dbc268', color: 'black', fontSize: '22px' }}
                className="cart-button"
                id="cartBtn"
                onClick={toggle}
            >
                <img src={cartImage} alt="" style={{ marginRight: '20px' }} />
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="sm">
                <DialogTitle style={{ backgroundColor: '#ebc642', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Review your Selections
                    {userType === 'Admin' && <> as Admin</>}
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#fff5d2', padding: '0px' }}>
                    {userType === 'Admin' ? (
                        <AdminCart
                            items={localStorage.getItem('cartItems')}
                            resetIsSelected={resetIsSelected}
                            requestOrder={requestOrder}
                        />
                    ) : (
                        <Cart
                            items={localStorage.getItem('cartItems')}
                            resetIsSelected={resetIsSelected}
                            requestOrder={requestOrder}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CartModel;
