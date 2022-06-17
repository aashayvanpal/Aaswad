import React from 'react'
import ItemForm from './Form.js'
import axios from '../../config/axios.js'

const ItemNew = () => {

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

    return (
        <div>
            <h1>Add New Item</h1>
            <ItemForm handleItemSubmit={handleItemSubmit} />
        </div>
    )
}

export default ItemNew