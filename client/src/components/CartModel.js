import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../css/HomePage/check.css'
import cartImage from '../images/cart-image.svg'
import Cart from './Cart.js'

const CartModel = (props) => {
    const {
        buttonLabel,
        className,
        resetIsSelected,
        requestOrder,

    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div >
            <Button style={{
                "backgroundColor": "#dbc268",
                "color": "black",
                "fontSize": "22px"
            }} className="cart-button" onClick={toggle}>
                <img src={cartImage} alt="" style={{ "marginRight": "20px" }} />
                {buttonLabel}
            </Button>
            <Modal isOpen={modal} toggle={toggle} className={className} >

                <ModalHeader style={{ "backgroundColor": "#fff5d2" }} toggle={toggle}>Review your Selections</ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2" }} >
                    <Cart
                        items={localStorage.getItem("cartItems")}
                        resetIsSelected={resetIsSelected}
                        requestOrder={requestOrder}
                    />
                </ModalBody>

            </Modal >
        </div >
    );
}

export default CartModel;