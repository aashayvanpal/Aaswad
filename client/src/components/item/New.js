import React, { useEffect, useState } from 'react'
import ItemForm from './Form.js'
import axios from '../../config/axios.js'
import ShowBtn from '../../assets/ShowBtn.js'
import NavigationBar from '../NavigationBar.js'
import { Link } from 'react-router-dom/cjs/react-router-dom.min.js'
import { getIngredients } from './item-helpers/item-functions.js'
const ItemNew = () => {
    const [ingredients, setIngredients] = useState([])

    const handleItemSubmit = (item) => {
        console.log('New Component : ', item)
        axios.post('/items/add', item, {
            headers: {
                "x-auth": localStorage.getItem('token')
            }
        })
            .then(response => {
                if (response.data.errors) {
                    console.log('Validation Error : ', response.data.errors)
                    window.alert(response.data.message)
                }
                else {
                    console.log('success', response.data)
                    localStorage.removeItem('cartItems')
                    console.log('Local storage cleared')
                    // this.props.history.push('/items')
                    window.location.href = '/items'
                }
            })
    }

    const fetchIngredients = async () => {
        const fetchedIngredients = await getIngredients()
        setIngredients([...fetchedIngredients])
    }
    useEffect(() => {
        fetchIngredients()
    }, [])

    return (
        <div>
            <ShowBtn />
            <div style={{ display: 'flex', gap: '20px' }}>
                <NavigationBar />
                <div style={{ width: '100%' }}>
                    <Link to='/items'>Back</Link>
                    <h1>Add New Item</h1>
                    <ItemForm handleItemSubmit={handleItemSubmit}
                        ingredients2={ingredients} setIngredients2={setIngredients}

                    />
                </div>
            </div>
        </div>
    )
}

export default ItemNew