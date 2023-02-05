import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ReportModal = (props) => {
    const {
        buttonLabel,
        className,
        resetIsSelected,
        requestOrder,
        userType,
        report,

    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const statusApprove = report.filter(order => order.status === 'approve')
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
                    Selected order
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "0px" }} >
                    <table>
                        <thead>
                            <th>SL No:</th>
                            <th>Name </th>
                            <th>Amount </th>
                            <th>Status </th>
                        </thead>
                        <tbody>
                            {report.map((order, i) => (<tr>
                                <td>{i + 1}</td>
                                <td>{order.name}</td>
                                <td>{order.amount}</td>
                                <td>{order.status}</td>
                            </tr>))}
                        </tbody>
                    </table>

                </ModalBody>
                <ModalFooter> Order Total:
                    {
                        report.reduce((acc, order) => acc + order.amount, 0)
                    }
                    <br />Total to be claimed:
                    {/* filter status approve and reduce */}
                    {
                        statusApprove.reduce((acc, order) => acc + order.amount, 0)
                    }
                </ModalFooter>

            </Modal >
        </div >
    );
}

export default ReportModal;