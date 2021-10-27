import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap';

export default class ItemShow extends React.Component {
    constructor() {
        super()
        this.state = {
            item: {}
        }
    }

    componentDidMount() {
        console.log('Item Show component mounted !')
        console.log('this.params', this.params)
        console.log('id to show', window.location.href.split('/')[5])
        const id = window.location.href.split('/')[5]
        axios.get(`/api/items/show/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data
                this.setState({ item })

                console.log('Edit :', this.state.item)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const { display, name, price, category, imgUrl, measured, ingredients, recipie } = this.state.item
        console.log("display item? :", display)
        console.log("category isArray? :", Array.isArray(category))
        return (
            <div style={{
                "border": "2px solid black",
                "backgroundColor": "#ffe175",
                "margin": "10px",
                "padding": "30px",
                "borderRadius": "10px",
                "boxShadow": "0px 5px 5px",
            }}>
                <Link to='/items'><button style={{
                    "backgroundColor": "#ff881a",
                    "borderRadius": "10px",
                    "padding": "10px",
                    "marginBottom": "20px",
                    "cursor": "pointer",
                    "fontSize": "22px",
                }}>Back</button></Link>
                <h2>Showing item details :-</h2>
                <Table responsive hover >
                    <tbody>
                        <tr>
                            <td><h2>Item Name</h2></td>
                            <td><h2>{name}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Price</h2></td>
                            <td><h2>{price}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Category</h2></td>
                            <td><h2>{category}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Measured in </h2></td>
                            <td><h2>{measured}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Image-URL</h2></td>
                            <td><h2>{imgUrl}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Display</h2></td>
                            <td><h2>{display ? ('True') : ('False')}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Ingredients</h2></td>
                            <td><h2>{ingredients}</h2></td>
                        </tr>
                        <tr>
                            <td><h2>Recipie</h2></td>
                            <td><h2>{recipie}</h2></td>
                        </tr>
                    </tbody>
                </Table>
            </div >
        )
    }
}