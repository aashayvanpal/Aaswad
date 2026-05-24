import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../css/itemForm.scss'

import AddIngredientModal from '../ingredients/modals/addIngredientsModal'


const ItemForm = (props) => {
    const checkforAll = () => {
        // this function matches for "all" value and removes it else returns the array
        if (props.item.category.includes('all')) {
            let newCategory = props.item.category
            newCategory.shift()
            // alert("entering true part" + newCategory)
        }
        else {
            return props.item.category
        }
    }

    const { ingredients2, setIngredients2 } = props
    // const [items, setItems] = useState([])
    const [name, setName] = useState(props.item ? props.item.name : "")
    const [price, setPrice] = useState(props.item ? props.item.price : "")
    const [category, setCategory] = useState(props.item ? checkforAll() : "") // if it contains all , remove it here
    const [measured, setMeasured] = useState(props.item ? props.item.measured : "")
    const [imgeURL, setImgeURL] = useState(props.item ? props.item.imgUrl : "default.png")
    const [description, setDescription] = useState(props.item ? props.item.description : "")
    // const [display, setDisplay] = useState(props.item ? props.item.display : "")
    const [ingredients, setIngredients] = useState(props.item ? props.item.ingredients : [])
    const [selectedValues, setSelectedValues] = useState(ingredients)

    const [recipie, setRecipie] = useState(props.item ? props.item.recipie : "")

    const handleSubmit = e => {
        e.preventDefault()
        console.log("Add item button clicked!")

        let categories = []
        categories.push("all")
        let categoryArray = []
        if (Array.isArray(category)) {
            categories = category
        } else {

            category.split(",").map(category => { return categories.push(category) })
        }
        console.log("categories setState array :", categories)
        console.log("ingrediends2 array :", ingredients2)
        // alert("ig2" + JSON.stringify(selectedValues))
        const item = {
            name: name,
            price: price,
            category: categories,
            measured: measured,
            imgUrl: imgeURL,
            display: false,
            ingredients: selectedValues,
            recipie: recipie,
            description: description
        }
        props.item && (item.id = props.item._id)

        console.log('props :', props)


        console.log("item Data: ", item)
        props.handleItemSubmit(item)

    }

    const append2InputFields = () => {
        const newIngredient = { name: '', quantity: '' }
        console.log("new Ingredient", newIngredient)
        setIngredients2([...ingredients2, newIngredient])
    }

    const handleDynamicChange = (ingredient, index, key) => {
        console.log("ingredients2 state", ingredients2)
        console.log("to change", ingredient, index)
        let tempIngredients = ingredients2
        tempIngredients[index][key] = ingredient
        setIngredients2([...tempIngredients])
    }

    useEffect(() => {
        console.log("debug", ingredients2)
    }, [ingredients2])
    useEffect(() => {
        console.log("mainIngredients", props.mainIngredients)
        setIngredients2(props.mainIngredients)

    }, [props.mainIngredients])
    useEffect(() => {
        setIngredients(selectedValues)
    }, [selectedValues])


    return (
        <div className="content-primary">
            <h2 className="item-form-heading">Add Item details</h2>

            dynamic category generation and multiple selection option ,CRUD operations for category <br />
            <form onSubmit={handleSubmit} id='itemForm'>
                <div className="form-row" id="formGroup">
                    <label htmlFor="name" className="form-label">Name</label>
                    <div className="form-col">
                        <input type="text" name="name" id="name" placeholder="Item name" value={name} onChange={(e) => { setName(e.target.value) }} />
                    </div>
                </div>
                <div className="form-row" id="formGroup">
                    <label htmlFor="price" className="form-label">Price</label>
                    <div className="form-col">
                        <input type="text" name="price" id="price" placeholder="Price" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                    </div>
                </div>
                <div className="form-row" id="formGroup">
                    <label htmlFor="category" className="form-label">Category</label>
                    <div className="form-col">
                        <input type="text" name="category" id="category" placeholder="Category" value={category} onChange={(e) => { setCategory(e.target.value) }} />
                    </div>
                </div>

                <div className="form-row" id="formGroup">
                    <label htmlFor="measured" className="form-label">Measured In</label>
                    <div className="form-col">
                        <select value={measured} onChange={(e) => { setMeasured(e.target.value) }} name="measured" id="measured">
                            <option value="">--</option>
                            <option value="pc">pc</option>
                            <option value="Kg">Kg</option>
                            <option value="plate">plate</option>
                        </select>
                    </div>
                </div>

                <div className="form-row" id="formGroup">
                    <label htmlFor="description" className="form-label">Description</label>
                    <div className="form-col">
                        <textarea name="description" id="imgeURL" placeholder="Item description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                    </div>
                </div>

                <div className="form-row" id="formGroup">
                    <label htmlFor="imgURL" className="form-label">Image URL</label>
                    <div className="form-col">
                        <textarea name="imgURL" id="imgeURL" placeholder="Image URL" value={imgeURL} onChange={(e) => { setImgeURL(e.target.value) }} />
                    </div>
                </div>

                <div className="form-row" id="formGroup">
                    <label htmlFor="ingredients" className="form-label">Ingredients</label>
                    <div className="form-col">
                        {Array.isArray(ingredients) ? <>{
                            ingredients.map(ingredient => <div key={ingredient.name}>{ingredient.name} {ingredient.quantity}</div>)
                        }</> : "old ingregients"}
                        <AddIngredientModal buttonLabel="Add ingredients"
                            append2InputFields={append2InputFields}
                            ingredients2={ingredients2}
                            handleDynamicChange={handleDynamicChange}
                            setIngredients2={setIngredients2}
                            selectedValues={ingredients}
                            setSelectedValues={setSelectedValues}
                        />
                    </div>
                </div>

                <div className="form-row" id="formGroup">
                    <label htmlFor="recipie" className="form-label">Recipie</label>
                    <div className="form-col form-col--mb">
                        <textarea name="recipie" id="recipie" placeholder="Recipie" value={recipie} onChange={(e) => { setRecipie(e.target.value) }} />
                    </div>
                </div>

                <div className="item-form-actions">
                    <Link to='/items'><button className="button-color3">Back</button></Link>
                    <input className="button-color3" type="submit" value="Add Item" />
                </div>
            </form>
        </div >
    )
}
export default ItemForm