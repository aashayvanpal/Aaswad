import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from "react-datepicker";
import moment from 'moment'
import { createEventOrder } from '../../../apis/eventOrders';

const CreateEventModal = (props) => {
    const {
        buttonLabel,
        className,
        refresh,
        setRefresh,
    } = props;

    const [modal, setModal] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());

    const toggle = () => setModal(!modal);

    const createEvent = async () => {
        const eventOrderBody = { eventName, eventDate: moment(eventDate).format('DD/MM/YYYY') }
        console.log('send this object inside events array to create event:', eventOrderBody)
        if (eventName === '') {
            alert('event name cannot be left blank!!')
        } else {
            await createEventOrder(eventOrderBody)
            toggle()
            setRefresh(!refresh)
        }
    }

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
                    Add Event Details
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#fff5d2', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        Event Name <input value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: '248px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Event Date <DatePicker
                            showIcon
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '320px' }}>
                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={toggle}>Cancel</button>
                    <button style={{ backgroundColor: 'rgb(219, 194, 104)' }} onClick={createEvent}>Create</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateEventModal;
