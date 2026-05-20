import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const ModalExample = (props) => {
    const { isOpen, closeModal, className } = props;

    return (
        <Dialog open={!!isOpen} onClose={closeModal} className={className}>
            <DialogTitle style={{ backgroundColor: 'rgb(196 153 0)', fontWeight: 'bold', color: 'green' }}>
                <h2 style={{ fontWeight: 'bold' }}>Query Submitted</h2>
            </DialogTitle>
            <DialogContent style={{ backgroundColor: '#dbc268', color: 'green' }}>
                Your enquiry has been submitted , we will get back soon!
            </DialogContent>
            <DialogActions style={{ backgroundColor: '#dbc268' }}>
                <Button
                    id="ok"
                    variant="contained"
                    style={{ backgroundColor: 'rgb(196 153 0)', color: 'black', fontWeight: 'bold' }}
                    onClick={closeModal}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalExample;
