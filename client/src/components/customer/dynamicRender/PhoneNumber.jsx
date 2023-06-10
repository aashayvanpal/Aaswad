const PhoneNumber = ({ formFields, setFormFields, phoneNumberError }) => {

    const removeNumber = (index) => {
        if (formFields.length > 1) {
            console.log("clicked on index:", index)
            formFields.splice(index, 1)
            setFormFields([...formFields])
        } else {
            alert('you must have atleast 1 number!')
        }

    }
    return <div className=".phone-number-css" style={{ border: '2px solid black', padding: '20px', margin: '20px' }}>

        {formFields.map((form, index) => <div key={index} style={{ border: "1px solid black", padding: '5px', margin: '5px' }}>
            save as
            <div style={{ display: 'flex' }}>
                <input id="phonenumber" onFocus={(e) => {
                    if (e.target.value === '') {
                        console.log("yes im in focus", e.target)

                    }
                }} placeholder={`${Object.keys(form)[0] ? Object.keys(form)[0] : "Custom- (Office,Home etc.)"}`} value={Object.keys(form)[0]} onChange={(e) => {
                    let data = formFields
                    Object.keys(data[index])[0] = e.target.value
                    data[index][e.target.value] = ''
                    delete data[index][`${Object.keys(data[index])[0]}`]
                    setFormFields([...data])
                }} />

                <input id="phonenumber" placeholder={`Enter Phone number`} value={form[`${Object.keys(form)[0]}`]} onChange={(e) => {
                    let data = formFields
                    data[index][`${Object.keys(data[index])[0]}`] = e.target.value
                    setFormFields([...data])
                }} />

                <button onClick={(e) => {
                    e.preventDefault()
                    removeNumber(index)
                }}>Remove Number</button>
            </div>
            <h4 style={{ color: 'red', fontSize: '15px' }}>{phoneNumberError[index]}</h4>

        </div>
        )}
        <button onClick={(e) => {
            e.preventDefault()
            setFormFields([...formFields, { 'secondary': '' }])
        }}>Add Phone Number</button>
    </div >

}

export default PhoneNumber