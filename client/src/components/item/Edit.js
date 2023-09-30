import React, { useEffect, useState } from 'react'
import axios from '../../config/axios'
import ItemForm from './Form.js'
import NavigationBar from '../NavigationBar'
import ShowBtn from '../../assets/ShowBtn'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { getIngredients } from './item-helpers/item-functions'
const EditItem = (props) => {
    const [item, setItem] = useState({})
    const [ingredients, setIngredients] = useState([])


    const fetchIngredients = async () => {
        const fetchedIngredients = await getIngredients()
        setIngredients([...fetchedIngredients])
    }

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

        fetchIngredients()

    }, [])

    const handleItemSubmit = (item) => {
        console.log('Edit item : ', item)
        console.log('ingredients : ', ingredients)


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
            .catch(err => alert("There was an error in adding item " + err))
    }

    return (
        <div>
            <ShowBtn />
            <div style={{ display: 'flex', gap: '20px' }}>
                <NavigationBar />
                <div style={{ width: '100%' }}>
                    <Link to='/items'>Back</Link>
                    <h1 style={{ "textAlign": "center", "padding": "10px" }}>Edit Item - {item.name}</h1>
                    {item.name && <ItemForm item={item}
                        handleItemSubmit={handleItemSubmit}
                        mainIngredients={ingredients}
                        ingredients2={ingredients}
                        setIngredients2={setIngredients}
                    />}
                </div>
            </div>
        </div>
    )
}

export default EditItem