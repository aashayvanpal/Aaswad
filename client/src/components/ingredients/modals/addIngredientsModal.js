import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './addIngredientsModal.scss'

const AddIngredient = (props) => {
    const {
        buttonLabel,
        className,
        append2InputFields,
        ingredients2,
        handleDynamicChange,
        setIngredients2,
        selectedValues,
        setSelectedValues,
        report = [],
    } = props;

    const [modal, setModal] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState(selectedValues)

    const toggle = () => setModal(!modal);

    const handleAddIngredient = (e, ingredient, quantity) => {
        e.preventDefault()
        let ingregientQTY = { ...ingredient, quantity }
        console.log('ingredient selected !->', ingregientQTY, quantity)
        setSelectedIngredients([...selectedIngredients, { ...ingregientQTY }])
    }

    const getSelectedIngregientList = () => {
        alert('clicked')
        console.log('selected ingregients :', selectedIngredients)
        setSelectedValues(selectedIngredients)
    }

    return (
        <div>
            <Button
                variant="contained"
                className="ingredient-modal-trigger-btn"
                onClick={toggle}
            >
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="sm">
                <DialogTitle className="ingredient-modal-title">
                    Add Ingredients
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent className="ingredient-modal-content">
                    <div>
                        <div className="ingredient-selected-box">
                            <h4 className="ingredient-selected-heading">SelectedIngredients</h4>
                            <table className="ingredient-selected-table">
                                <thead>
                                    <tr>
                                        <td>Sl no</td>
                                        <td>Particulars</td>
                                        <td>Quantity</td>
                                        <td>Actions</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedIngredients.map((ingredient, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{ingredient?.name}</td>
                                            <td>{ingredient?.quantity}</td>
                                            <td>
                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    let tempIngredients2 = selectedValues
                                                    tempIngredients2.splice(index, 1)
                                                    setSelectedIngredients([...tempIngredients2])
                                                }}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="ingredient-submit-list-btn" onClick={getSelectedIngregientList}>Submit Selected List</button>
                        </div>

                        <button className="ingredient-add-new-btn" onClick={(e) => { e.preventDefault(); append2InputFields() }}>Add new Ingredient</button>

                        {ingredients2?.map((ingredient, index) => (
                            <div key={index}>
                                <input placeholder="name" onChange={(e) => handleDynamicChange(e.target.value, index, 'name')} value={ingredient.name} />
                                <input placeholder="quantity" onChange={(e) => handleDynamicChange(e.target.value, index, 'quantity')} value={ingredient.quantity} />
                                <button onClick={(e) => handleAddIngredient(e, ingredient, ingredients2[index]['quantity'])}>Add</button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions />
            </Dialog>
        </div>
    );
}

export default AddIngredient;
