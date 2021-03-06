import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../css/HomePage/check.css'
import Cart from './Cart.js'

const CartModel = (props) => {
    const {
        buttonLabel,
        className,
        cartItems,
        removeItemFromCart,
        resetIsSelected,
        requestOrder,
        items,
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div >
            <Button style={{
                "backgroundColor": "#dbc268"
            }} className="cart-button" onClick={toggle}>{buttonLabel} </Button>
            <Modal isOpen={modal} toggle={toggle} className={className} >
                <ModalHeader style={{ "backgroundColor": "#fff5d2" }} toggle={toggle}>Cart Items<br />Review your menu</ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2" }} >
                    <Cart
                        items={items}
                        cartItems={cartItems}
                        removeItemFromCart={removeItemFromCart}
                        resetIsSelected={resetIsSelected}
                        requestOrder={requestOrder}
                    />
                </ModalBody>

            </Modal>
        </div>
    );
}

export default CartModel;