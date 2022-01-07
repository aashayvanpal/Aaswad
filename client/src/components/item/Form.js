import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { Table } from 'reactstrap';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';
import '../../css/itemForm.css'

export default class ItemForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            name: props.item ? props.item.name : "",
            price: props.item ? props.item.price : "",
            category: props.item ? props.item.category : "",
            measured: props.item ? props.item.measured : "",
            imgUrl: props.item ? props.item.imgUrl : "default.png",
            display: props.item ? props.item.display : "",
            ingredients: props.item ? props.item.ingredients : "",
            recipie: props.item ? props.item.recipie : "",
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this)
    }

    onSelect(selectedList, selectedItem) {
        console.log('inside onSelect')
        console.log('selectedList', selectedList)
        console.log('selectedItem', selectedItem)
        this.setState({ selectedValues: selectedList })

    }
    onRemove(selectedList, selectedItem) {
        console.log('inside onRemove')
        console.log('selectedList', selectedList)
        console.log('selectedItem', selectedItem)
        this.setState({ selectedValues: selectedList })

    }


    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        console.log("Add item button clicked!")

        let categories = []
        categories.push("all")
        this.state.category.split(",").map(category => { return categories.push(category) })
        console.log("categories setState array :", categories)
        const item = {
            name: this.state.name,
            price: this.state.price,
            category: categories,
            measured: this.state.measured,
            imgUrl: this.state.imgUrl,
            display: false,
            ingredients: this.state.ingredients,
            recipie: this.state.recipie
        }
        this.props.item && (item.id = this.props.item._id)

        console.log('props :', this.props)


        console.log("item Data: ", item)
        this.props.handleItemSubmit(item)

        // axios.post('http://localhost:3001/items/add', item, {
        //     headers: {
        //         "x-auth": localStorage.getItem('token')
        //     }
        // })
        //     .then(response => {
        //         if (response.data.errors) {
        //             console.log('Validation Error : ', response.data.errors)
        //             window.alert(response.data.message)
        //         }
        //         else {
        //             console.log('success', response.data)
        //             // this.props.history.push('/items')
        //             window.alert('Added successfully')
        //             window.location.href = '/items'

        //         }
        //     })


        // this.setState((prevState) => ({ items: [item, ...prevState.items], }))
        // console.log("items array :", this.state.items)

        // window.location.href = '/items'

    }

    render() {
        return (
            <div className="content-primary">
                <h2 style={{
                    "textAlign": "center",
                    "padding": "20px",
                    "color": "white",
                    "background": "#0173a9",
                    "fontWeight": "bold"
                }}>Add Item details</h2>
                <Form onSubmit={this.handleSubmit} id='itemForm' >
                    <FormGroup row id='formGroup'>
                        <Label for="name" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Name</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="name" placeholder="Item name" value={this.state.name} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row id='formGroup'>
                        <Label for="price" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Price</Label>
                        <Col sm={10}>
                            <Input type="text" name="price" id="price" placeholder="Price" value={this.state.price} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row id='formGroup'>
                        <Label for="category" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Category</Label>
                        <Col sm={10}>
                            <Input type="text" name="category" id="category" placeholder="Category" value={this.state.category} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>

                    <FormGroup row id='formGroup'>
                        <Label for="measured" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Measured In</Label>
                        <Col sm={10}>
                            <Input type="select" value={this.state.measured} onChange={this.handleChange} name="measured" id="measured">
                                <option value="">--</option>
                                <option value="pc">pc</option>
                                <option value="Kg">Kg</option>
                                <option value="plate">plate</option>
                            </Input>
                        </Col>
                    </FormGroup>

                    <FormGroup row id='formGroup'>
                        <Label for="imgURL" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Image URL</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="imgURL" id="imgeURL" placeholder="Image URL" value={this.state.imgUrl} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>

                    <FormGroup row id='formGroup'>
                        <Label for="ingredients" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Ingredients</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="ingredients" id="ingredients" placeholder="Ingredients" value={this.state.ingredients} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>

                    <FormGroup row id='formGroup'>
                        <Label for="recipie" sm={2} style={{ textAlign: "center", fontSize: "22px" }}>Recipie</Label>
                        <Col sm={10} style={{ marginBottom: "30px" }}>
                            <Input type="textarea" name="recipie" id="recipie" placeholder="Recipie" value={this.state.recipie} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>

                    <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
                        <Link to='/items'><button className="button-color3" >Back</button></Link>

                        <input className="button-color3" type="submit" value="Add Item" />
                    </div>
                </Form>
            </div>
        )
    }
}













