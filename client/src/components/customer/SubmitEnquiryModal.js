import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ModalExample = (props) => {
    const {
        className,
        isOpen,
        closeModal
    } = props;

    return (
        <div>
            <Modal isOpen={isOpen} toggle={closeModal} className={className}>
                <ModalHeader toggle={closeModal} style={{
                    "backgroundColor": "rgb(196 153 0)",
                    "fontWeight": "bold",
                    "color": "green",
                }}><h2  style={{
                    "fontWeight": "bold",
                }}>Query Submitted</h2></ModalHeader>
                <ModalBody style={{
                    "backgroundColor": "#dbc268",
                    "color": "green",
                }}>
                    Your enquiry has been submitted , we will get back soon!
                </ModalBody>
                <ModalFooter style={{ "backgroundColor": "#dbc268", }}>
                    <Button id="ok" style={{
                        "backgroundColor": "rgb(196 153 0)", "color": "black",
                        "fontWeight": "bold"
                    }} onClick={closeModal}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalExample;