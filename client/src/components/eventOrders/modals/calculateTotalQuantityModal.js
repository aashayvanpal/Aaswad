import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from "react-datepicker";
import moment from 'moment'
import { createEventOrder } from '../../../apis/eventOrders';

const CalculateTotalQuantity = (props) => {
    const {
        buttonLabel,
        className,
        refresh,
        setRefresh,
        resetIsSelected,
        requestOrder,
        userType,
        report = [], //default set to array
        totalItems,
        getSelectedOrders,
        eventDate,
        eventName

    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    useEffect(() => {
        if (modal) {
            getSelectedOrders()
        }
    }, [modal])

    const cancelModal = () => {
        toggle()
    }
    // useEffect(() => {
    //     console.log("only selectedorders changed :", selectedOrders)
    // }, [selectedOrders])
    return (
        <div >
            <Button style={{
                "backgroundColor": "#dbc268",
                "color": "black",
                "fontSize": "22px"
            }} onClick={toggle}>
                {buttonLabel}

            </Button>
            <Modal isOpen={modal} toggle={toggle} className={className} >
                <ModalHeader style={{ "backgroundColor": "#ebc642" }} toggle={toggle}>
                    Total Item Requirements <br />
                    Event Name -{eventName}<br />
                    Event Date -{eventDate}

                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "20px" }} >
                    <table>
                        <thead>
                            <tr>
                                {/* <td>Item id</td> */}
                                <td>ITEM </td>
                                <td>TOTAL QUANTITY</td>
                            </tr>
                        </thead>
                        <tbody>
                            {totalItems.map((item, index) => <tr key={index}>
                                {/* <td>{item.id}</td> */}
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity} {item.measured}</td>
                            </tr>)}
                        </tbody>
                    </table>


                </ModalBody>
                <ModalFooter style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '320px' }}>

                    <button style={{ backgroundColor: '#ebc642' }} onClick={cancelModal}>OK</button>

                </ModalFooter>

            </Modal >
        </div >
    );
}

export default CalculateTotalQuantity;