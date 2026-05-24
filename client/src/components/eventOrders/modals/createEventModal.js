import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'
import moment from 'moment'
import { createEventOrder } from '../../../apis/eventOrders';
import './eventModals.scss'

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
                className="event-modal-trigger-btn"
                onClick={toggle}
            >
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="sm">
                <DialogTitle className="event-modal-title">
                    Add Event Details
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent className="event-modal-content">
                    <div className="event-modal-field-row">
                        Event Name <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="event-modal-name-input" />
                    </div>
                    <div className="event-modal-field-row--last">
                        Event Date
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={eventDate}
                                onChange={(date) => setEventDate(date)}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                    </div>
                </DialogContent>
                <DialogActions className="event-modal-actions">
                    <button className="event-modal-cancel-btn" onClick={toggle}>Cancel</button>
                    <button className="event-modal-create-btn" onClick={createEvent}>Create</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateEventModal;
