import React, { useState } from 'react'

const AdvancePaymentForm = (props) => {
    const [amount, setAmount] = useState(props.advanceAmount)


    const handleSubmit = (e) => {
        console.log('inside handleform AdvancePayment Form')

        e.preventDefault()
        // post request storing an object of string and number and then renedering a table 
        console.log('AdvanceAmount:',amount )

        // post request find and replace or create new key value pair
        props.ShowAdvancePaymentTable(amount)
        props.ShowAdvancePaymentForm()
    }



    return <div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter Advance Payment" value={amount} required onChange={(e) => setAmount(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
        {/* {showTable && showTable1()} */}
    </div >
}

export default AdvancePaymentForm