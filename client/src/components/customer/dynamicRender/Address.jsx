
const Address = ({ formFields, setAddressFields }) => {
    const addAddressField = (e) => {
        e.preventDefault()
        setAddressFields([...formFields, { 'secondary': '' }])
    }
    const removeAddress = (index) => {
        if (formFields.length > 1) {
            console.log("clicked on index:", index)
            formFields.splice(index, 1)
            setAddressFields([...formFields])
        } else {
            alert('you must have atleast 1 Address!')
        }
    }

    return <div style={{ border: '2px solid black', margin: '5px', padding: '5px' }}>
        {/* <textarea id="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} /> */}


        {formFields.map((form, index) => <div key={index} style={{ border: '2px solid black', margin: '5px', padding: '5px' }}>
            <input value={`${Object.keys(form)[0]}`} placeholder={`Custom (Office,Home etc.)`} onChange={(e) => {
                let data = formFields
                Object.keys(data[index])[0] = e.target.value
                data[index][e.target.value] = ''
                delete data[index][`${Object.keys(data[index])[0]}`]
                setAddressFields([...data])
            }} />

            <textarea id="address" placeholder="Address" onChange={(e) => {
                let data = formFields
                data[index][`${Object.keys(data[index])[0]}`] = e.target.value
                setAddressFields([...data])
            }} />

            <button onClick={(e) => removeAddress(index)}>Remove Address</button>
        </div>)}

        <button onClick={(e) => addAddressField(e)}>Add Address</button><br />
    </div>
}

export default Address