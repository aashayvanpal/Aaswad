import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FilterableSelectBox from '../../autoCompleteSelect';
const CustomerModal = (props) => {
    const {
        buttonLabel,
        className,
        customers,
        setSelectedCustomerDetails

    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);


    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [filterValue, setFilterValue] = useState('');

    return (
        <div >
            <Button style={{
                "backgroundColor": "#dbc268",
                "color": "black",
                "fontSize": "22px"
            }} onClick={toggle}>
                {buttonLabel}

            </Button>
            <Modal size="lg" isOpen={modal} toggle={toggle} className={className} >
                <ModalHeader style={{ "backgroundColor": "#ebc642" }} toggle={toggle}>
                    Select your Customer Details
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "0px" }} >
                    <FilterableSelectBox
                        options={customers}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                        selectedPhoneNumber={selectedPhoneNumber}
                        setSelectedPhoneNumber={setSelectedPhoneNumber}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                    />
                </ModalBody>
                <ModalFooter>
                    <button onClick={() => {
                        // console.log("current customer details", { selectedCustomer, selectedPhoneNumber, selectedAddress })
                        toggle()
                        setSelectedCustomerDetails({ selectedCustomer, selectedPhoneNumber, selectedAddress })
                    }}>Confirm Customer</button>
                </ModalFooter>

            </Modal >
        </div >
    );
}

export default CustomerModal;