import React, { useEffect, useState } from 'react'
import axios from '../../config/axios'
import ItemForm from './Form.js'

const EditItem = (props) => {
    const [item, setItem] = useState({})
    useEffect(() => {
        console.log('props:', props)
        console.log('id to edit', window.location.href.split('/')[5])
        const id = window.location.href.split('/')[5]

        axios.get(`/items/edit/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data
                // this.setState({ item })
                setItem(item)
                console.log('Edit :', item)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleItemSubmit = (item) => {
        console.log('Edit item : ', item)
        axios.put(`/items/edit/${item.id}`, item, {
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
                    localStorage.removeItem("cartItems")
                    console.log('localstorage cleared')
                    // this.props.history.push(`/items/show/${response.data._id}`)
                    window.location.href = '/items'

                }
            })
    }

    return (
        <div>
            <h1 style={{ "textAlign": "center", "padding": "10px" }}>Edit Item - {item.name}</h1>
            {item.name && <ItemForm item={item} handleItemSubmit={handleItemSubmit} />}
        </div>
    )
}

export default EditItem