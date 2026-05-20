import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ReportModal = (props) => {
    const {
        buttonLabel,
        className,
        report = [],
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const statusApprove = report?.filter(order => order.status === 'approve')

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
                    Selected order
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#fff5d2', padding: '0px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>SL No:</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report?.map((order, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{order.name}</td>
                                    <td>{order.amount}</td>
                                    <td>{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#fff5d2' }}>
                    Order Total: {report?.reduce((acc, order) => acc + order.amount, 0)}
                    <br />Total to be claimed: {statusApprove?.reduce((acc, order) => acc + order.amount, 0)}
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ReportModal;
