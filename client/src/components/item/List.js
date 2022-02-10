// fix url config (store in folder)
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DisplayItems from './Item.js'
// import SearchItem from './Search.js'
import axios from '../../config/axios.js'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import confirm from 'reactstrap-confirm'
import addIcon from '../../images/add-item-icon.png'

export default class AddItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [

            ],
            searchFilter: []

        }

        this.deleteItem = this.deleteItem.bind(this)
        this.updateCheckbox = this.updateCheckbox.bind(this)
    }


    componentDidMount() {
        axios.get('/api/items', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Data : ', response.data)
                const items = response.data
                console.log('items after request :', items)
                this.setState({ items })
                this.setState({ searchFilter: this.state.items })
            })
            .catch(err => {
                console.log(err)
            })
    }


    handleChange = e => {
        console.log('Inside handleChange')
        console.log('e.target.value:', e.target.value)
        console.log('this.state.items:', this.state.items)
        console.log('this.state.items filtered:', this.state.items.filter(item => item.name.includes(e.target.value)))

        let searchFilter = this.state.items.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        this.setState({ searchFilter })

        // this.setState({
        //     item: e.target.value
        // })
    }



    async deleteItem(itemToDelete) {
        console.log('called parent component delete id', itemToDelete)
        // console.log("remove button clicked!")
        // console.log("value of this ", this)
        // console.log("value of this.items ", this.state.items)
        // console.log("value of itemToDelete ", itemToDelete)

        //confirm to delete
        let result = await confirm({
            title: (
                <div style={{ "color": "black", "fontWeight": "bold" }}>
                    Delete item Confirmation
                </div>
            ),
            message: (
                <div style={{ "color": "green" }}>
                    Are you sure you want to delete this item ??
                </div>
            ),
            confirmText: "Delete",
            confirmColor: "warning",
            cancelColor: "link text-danger",
            classNames: 'confirmModal'
        })
        console.log("result is :", result)

        if (result) {
            axios.delete(`/items/${itemToDelete}`, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log('response data', response.data)
                    console.log('Inside the .then promise')

                    // this.setState((prevState) => ({
                    //     searchFilter: prevState.searchFilter.filter(item => item._id !== response.data._id),
                    // }))
                    var filteredItems = this.state.searchFilter.filter(item => item._id !== response.data._id)
                    this.setState({ searchFilter: filteredItems })

                    // this.setState({ items: this.state.searchFilter })

                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            console.log("dont delete the item")
        }

        // this.setState(
        //     prevState => ({
        //         items: prevState.items.filter(item => item !== itemToDelete)
        //     })
        // )
    }

    updateCheckbox = (itemToToggle) => {
        console.log('inside the toggle checkbox')
        console.log("itemToToggle id:", itemToToggle)
        // you have found the id, you have to get the whole item 
        const foundItem = this.state.items.find(item => item._id === itemToToggle)
        console.log('Item found :', foundItem)
        console.log('Item found\'s display before:', foundItem.display)
        console.log('Edit item : ', foundItem)

        const index = this.state.items.findIndex(item => item._id === itemToToggle)
        console.log('the index is :', index)

        console.log('state of items :', this.state.items)
        console.log('spread :', ...this.state.items)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = this.state.items
        changedItems[index].display = !changedItems[index].display

        this.setState({ items: changedItems })

        axios.put(`/items/edit/${foundItem._id}`, foundItem, {
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
                    // this.props.history.push(`/items/show/${response.data._id}`)
                    // window.location.href = '/items'
                }
            })

        console.log('Item found\'s display after:', this.state.items)
        // console.log('Item found\'s display after:', foundItem.display)

    }

    render() {
        return (
            <div className="content-primary">
                <div className="search-align">
                    <h2>Listing items - {this.state.searchFilter.length}</h2>

                    <input type="text" placeholder="Search Item" name="item" style={{ "textAlign": "center" }} onChange={this.handleChange} />&nbsp;&nbsp;


                </div>
                <Link to='/items/add'> <button className="button-color3">
                    <img src={addIcon} alt="addIcon" height="35px" width="30px" />
                    Add new item
                </button></Link>

                <div style={{ "margin": "10px" }}>
                    <Table>
                        <Thead >
                            <Tr className="listing-table" style={{ "fontWeight": "bold" }}>
                                <Th className="listing-table">Sl No</Th>
                                <Th className="listing-table">Name</Th>
                                <Th className="listing-table">Price</Th>
                                <Th className="listing-table"> Update</Th>
                                <Th className="listing-table"> Active/Inactive</Th>
                                <Th className="listing-table"> Remove</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {
                                this.state.searchFilter.map((item, i) => {
                                    return (
                                        <DisplayItems
                                            key={i}
                                            name={item.name}
                                            price={item.price}
                                            deleteItem={this.deleteItem}
                                            updateCheckbox={this.updateCheckbox}
                                            id={item._id}
                                            display={item.display}
                                            i={i}
                                        />
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </div>
            </div>
        )
    }
}