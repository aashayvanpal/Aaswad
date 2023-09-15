import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from "react-datepicker";
import moment from 'moment'
import { createEventOrder } from '../../../apis/eventOrders';

const CreateEventModal = (props) => {
    const {
        buttonLabel,
        className,
        refresh,
        setRefresh,
        resetIsSelected,
        requestOrder,
        userType,
        report = [], //default set to array

    } = props;

    const [modal, setModal] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());

    const toggle = () => setModal(!modal);


    const createEvent = async () => {
        const eventOrderBody = { eventName, eventDate: moment(eventDate).format('DD/MM/YYYY') }
        console.log("send this object inside events array to create event:", eventOrderBody)
        if (eventName === '') {
            alert("event name cannot be left blank!!")
        } else {
            // API here to create event and add to DB
            const response = await createEventOrder(eventOrderBody)
            toggle()
            setRefresh(!refresh)
        }
    }
    const cancelModal = () => {
        toggle()
    }
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
                    Add Event Details
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "20px" }} >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        Event Name <input value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: '248px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        Event Date <DatePicker
                            showIcon
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            dateFormat={"dd/MM/yyyy"}
                        />
                    </div>

                </ModalBody>
                <ModalFooter style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '320px' }}>

                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={cancelModal}>Cancel</button>
                    <button style={{ backgroundColor: 'rgb(219, 194, 104)' }} onClick={createEvent}>Create</button>

                </ModalFooter>

            </Modal >
        </div >
    );
}

export default CreateEventModal;