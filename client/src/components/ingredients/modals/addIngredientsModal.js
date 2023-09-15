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
        setIngredients2

    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const statusApprove = report?.filter(order => order.status === 'approve')

    const [selectedIngredients, setSelectedIngredients] = useState([])
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
                        <div>selectedIngredients

                            {selectedIngredients.map((ingredient, index) => <div key={index}>
                                {ingredient?.name}
                                {/* <input placeholder="name" onChange={(e) => handleDynamicChange(e.target.value, index, 'name')} value={ingredient.name} /> */}
                                {/* <input placeholder="quantity" onChange={(e) => handleDynamicChange(e.target.value, index, 'quantity')} value={ingredient.quantity} /> */}


                                <button onClick={(e) => {
                                    e.preventDefault()

                                    let tempIngredients2 = ingredients2
                                    tempIngredients2.splice(index, 1)

                                    console.log("temp ingre", tempIngredients2)
                                    setIngredients2([...tempIngredients2])
                                }}>Remove</button>

                            </div>)}

                        </div>
                        <button onClick={(e) => {
                            e.preventDefault()
                            append2InputFields()
                        }}>Add Ingredient</button>
                        {
                            ingredients2?.map((ingredient, index) => (<div key={index}>

                                <input placeholder="name" onChange={(e) => handleDynamicChange(e.target.value, index, 'name')} value={ingredient.name} />
                                <input placeholder="quantity" onChange={(e) => handleDynamicChange(e.target.value, index, 'quantity')} value={ingredient.quantity} />

                                <button onClick={(e, ingredient) => {
                                    e.preventDefault()
                                    console.log("ingredient selected !->" + { ...ingredient })
                                    setSelectedIngredients([...selectedIngredients, ingredient])
                                }}>Add</button>

                            </div>))
                        }
                    </div>

                </ModalBody>
                <ModalFooter>
                    Order Total:
                    {
                        report?.reduce((acc, order) => acc + order.amount, 0)
                    }

                </ModalFooter>

            </Modal >
        </div >
    );
}

export default AddIngredient;