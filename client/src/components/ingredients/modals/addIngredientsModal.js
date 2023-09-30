import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AddIngredient = (props) => {
    const {
        buttonLabel,
        className,
        resetIsSelected,
        requestOrder,
        userType,
        report = [], //default set to array
        append2InputFields,
        ingredients2,
        handleDynamicChange,
        setIngredients2,
        selectedValues,
        setSelectedValues

    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const statusApprove = report?.filter(order => order.status === 'approve')

    const [selectedIngredients, setSelectedIngredients] = useState(selectedValues)

    const handleAddIngredient = (e, ingredient, quantity) => {
        e.preventDefault()
        let ingregientQTY = { ...ingredient, quantity }
        console.log("ingredient selected !->", ingregientQTY, quantity)
        setSelectedIngredients([...selectedIngredients, { ...ingregientQTY }])
    }

    const getSelectedIngregientList = () => {
        alert("clicked")
        console.log("selected ingregients :", selectedIngredients);
        setSelectedValues(selectedIngredients)
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
                    Add Ingredients
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "0px" }} >


                    <div>
                        <div style={{ border: '2px solid black', margin: '10px', padding: '10px', borderRadius: '32px' }}>
                            <h4 style={{ textAlign: 'center' }}>SelectedIngredients</h4>
                            <table style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '80%' }}>
                                <thead>
                                    <tr>
                                        <td>Sl no </td>
                                        <td>Particulars</td>
                                        <td>Quantity</td>
                                        <td>Actionssss</td>
                                    </tr>
                                </thead>
                                <tbody>

                                    {selectedIngredients.map((ingredient, index) => <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{ingredient?.name}</td>
                                        <td>{ingredient?.quantity}</td>
                                        <td>
                                            <button onClick={(e) => {
                                                e.preventDefault()

                                                let tempIngredients2 = selectedValues
                                                tempIngredients2.splice(index, 1)

                                                console.log("temp ingre", tempIngredients2)
                                                // setIngredients2([...tempIngredients2])
                                                setSelectedIngredients([...tempIngredients2])
                                            }}>Remove</button>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                            <button style={{ width: '100%', marginTop: '10px', borderRadius: '16px' }} onClick={getSelectedIngregientList}>Submit Selected List</button>
                        </div>


                        <button
                            style={{ margin: '20px' }}
                            onClick={(e) => {
                                e.preventDefault()
                                append2InputFields()
                            }}>Add new Ingredient</button>

                        {
                            ingredients2?.map((ingredient, index) => (<div key={index}>
                                {/* {ingredient._id.substr(0, 2)} */}
                                <input placeholder="name" onChange={(e) => handleDynamicChange(e.target.value, index, 'name')} value={ingredient.name} />
                                <input placeholder="quantity" onChange={(e) => handleDynamicChange(e.target.value, index, 'quantity')} value={ingredient.quantity} />

                                {/* <input type='submit' value={"Add"} /> */}
                                <button onClick={(e) => handleAddIngredient(e, ingredient, ingredients2[index]['quantity'])}>Add</button>
                            </div>))
                        }
                    </div>

                </ModalBody>
                <ModalFooter>


                </ModalFooter>

            </Modal >
        </div >
    );
}

export default AddIngredient;