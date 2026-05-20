import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FilterableSelectBox from '../../autoCompleteSelect';

const CustomerModal = (props) => {
    const {
        buttonLabel,
        className,
        customers,
        setSelectedCustomerDetails,
    } = props;

    const [modal, setModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [filterValue, setFilterValue] = useState('');

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#dbc268', color: 'black', fontSize: '22px' }}
                onClick={toggle}
            >
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="md">
                <DialogTitle style={{ backgroundColor: '#ebc642', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Select your Customer Details
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#fff5d2', padding: '0px' }}>
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
                </DialogContent>
                <DialogActions>
                    <button onClick={() => {
                        toggle()
                        setSelectedCustomerDetails({ selectedCustomer, selectedPhoneNumber, selectedAddress })
                    }}>Confirm Customer</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CustomerModal;
