import React, { useState } from 'react'

const TransportForm = (props) => {
    const [medium, setMedium] = useState(props.medium)
    const [price, setPrice] = useState(props.price)


    const handleSubmit = (e) => {
        console.log('inside handleform')

        e.preventDefault()
        // post request storing an object of string and number and then renedering a table 
        const transportObject = {
            medium: medium, price: price
        }
        console.log('transportobject:', transportObject)

        // post request find and replace or create new key value pair
        props.ShowTransportTable(medium, price)
        props.ShowTransportForm()
    }



    return <div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter Medium" value={medium} required onChange={(e) => setMedium(e.target.value)} />
            <input placeholder="Enter Price" value={price} required onChange={(e) => setPrice(e.target.value)} /><br />
            <button type="submit">Submit</button>
        </form>
        {/* {showTable && showTable1()} */}
    </div >
}

export default TransportForm