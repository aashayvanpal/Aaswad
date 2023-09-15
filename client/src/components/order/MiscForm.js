// this is dynamic form when we need to extend the form contents
import React, { useState } from 'react'

const MiscForm = ({ miscItems, setMiscParticulars, handleMiscSubmit }) => {

    const handleParticularsChange = (index, e, fieldName) => {
        // console.log("index, item,name", index, e.target.value, fieldName)
        let oldItems = miscItems
        oldItems[index][fieldName] = e.target.value
        setMiscParticulars([...oldItems])
    }

    const addNewFields = (e) => {
        e.preventDefault()
        setMiscParticulars([...miscItems, {
            particular: '', rate: ''
        }])
    }
    const handleDeleteField = (e, index) => {
        e.preventDefault()
        // remove index from array
        console.log("before", miscItems)
        miscItems.splice(index, 1)
        console.log("after", miscItems)
        setMiscParticulars([...miscItems])
    }

    return <div>
        <form onSubmit={handleMiscSubmit}>
            {/* <input type="text" placeholder="Enter Particulars" value={medium} required onChange={(e) => setMedium(e.target.value)} />
            <input placeholder="Enter Price" value={price} required onChange={(e) => setPrice(e.target.value)} /><br />
            <button type="submit">Submit</button> */}
            <table>
                <thead>
                    <tr>
                        <th>Particulars</th>
                        <th>Rate</th>
                        <th><button onClick={(e) => addNewFields(e)}>Add New</button></th>
                    </tr>
                </thead>
                <tbody>
                    {miscItems.map((item, index) => <tr key={index}>
                        <td><input placeholder='Enter Particulars' name='particular' value={item.particular} onChange={(e) => handleParticularsChange(index, e, 'particular')} /></td>
                        <td><input placeholder='Enter Rate' name='rate' value={item.rate} onChange={(e) => handleParticularsChange(index, e, 'rate')} /></td>
                        <td><button onClick={(e) => handleDeleteField(e, index)}>Delete</button></td>
                    </tr>)}
                </tbody>


            </table>
            <input type='submit' />
        </form>
        {/* {showTable && showTable1()} */}
    </div >
}

export default MiscForm