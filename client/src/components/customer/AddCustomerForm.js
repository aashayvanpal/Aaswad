// This form is being reused for editing and adding a new customer
// when editing grab from localstorage , on click of add customer do the update query
// when adding new customer , check if customer already exits in db with name and phone number and perform post query
// bug :select tag must be set correctly ny default when editing customer 
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PhoneNumber from "./dynamicRender/PhoneNumber"
import Address from "./dynamicRender/Address"
import Language from "./dynamicRender/Language"
import { createCustomer, updateCustomer } from "../../apis/customers"
import { useHistory } from 'react-router-dom'
import { getCustomerById } from "../../apis/customers"

const AddCustomerForm = () => {

    const history = useHistory()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('male')
    const [profilePicture, setProfilePicture] = useState('')
    const [status, setStatus] = useState("inactive")
    const [level, setLevel] = useState("basic")
    const [addresses, setAddresses] = useState([
        { 'primary': '' }
    ])
    const [birthday, setBirthday] = useState('')
    const [languages, setLanguages] = useState(['English'])
    const [points, setPoints] = useState(0)

    const [phoneNumbers, setPhoneNumbers] = useState([
        { 'primary': '' },
    ])

    // Errors and settors
    const [fullNameError, setFullNameError] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState([])

    const validateCustomer = (customer) => {
        // Full name cannot be blank
        if (customer.fullName === '') {
            alert("Full Name field cannot be left blank")

            setFullNameError("Full Name field cannot be left blank")
            return false
        } else {
            setFullNameError('')
        }

        const validatePhonenumber = (item, index) => {

            for (const property in item) {
                // phone number cannot be left blank
                if (item[property].length === 0) {
                    alert(`Invalid Phone number :- ${property}: ${item[property]} Cannot be left blank`)
                    let phoneIndex = phoneNumberError
                    phoneIndex[index] = 'Cannot be left blank'
                    setPhoneNumberError([...phoneIndex])
                    return false
                } else {
                    let phoneIndex = phoneNumberError
                    phoneIndex[index] = ''
                    setPhoneNumberError([...phoneIndex])
                }
                // phone number must be a digit
                if (!Number.isInteger(Number(item[property]))) {
                    alert(`Invalid Phone number:- ${property}: ${item[property]} is not a digit`)
                    let phoneIndex = phoneNumberError
                    phoneIndex[index] = 'Must be a digit'
                    console.log("phone err or :", phoneIndex)
                    setPhoneNumberError([...phoneIndex])

                    return false
                } else {
                    let phoneIndex = phoneNumberError
                    phoneIndex[index] = ''
                    setPhoneNumberError([...phoneIndex])
                }

                // phonenumber length should be = 10
                if (item[property].length != 10) {
                    alert(`Invalid Phone number :- ${property}: ${item[property]} needs to be of 10 digits`)
                    let phoneIndex = phoneNumberError
                    phoneIndex[index] = 'Must have 10 digits'

                    setPhoneNumberError([...phoneIndex])
                    return false
                } else {
                    let phoneIndex = phoneNumberError
                    phoneIndex[index] = ''
                    setPhoneNumberError([...phoneIndex])
                }
            }
        }

        // must have 1 phone number 
        const phoneNumbers = customer.phoneNumber
        const validPhoneNumbers = phoneNumbers.map((phone, index) => validatePhonenumber(phone, index))

        if (validPhoneNumbers.includes(false)) {
            // phone number is invalid so stop and return false
            return false
        }
        return true
    }


    const createNewCustomer = async (customer) => {
        // before adding check if name and phone number exists , if exists propmt there is a user and if you would like to create another name instead
        const existingUser = false
        if (!existingUser) {
            // Backend Post request
            console.log("customer object to post ", customer)

            // validate customer from backend
            // create customer api POST request ->call
            const customerCreated = await createCustomer(customer)
            console.log("customer created!", customerCreated)
            if (customerCreated.status === 200) {
                alert("customer has been created successfully!")
                // navigate to /customers
                history.push("/customers")
            } else {
                alert("there was something wrong with customer creation")
            }
        } else {
            alert("This user exists ,you should check again in db")
        }
    }


    const editCustomer = (id, customer) => {
        console.log("update customer put request here customer debug", id, customer)
        updateCustomer(id, customer)
        alert("update customer put request complete")
        history.push("/customers")


    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // fix the form dynamic part
        // setting all default form values
        // setting required fields


        // get customer object
        const customer = {
            fullName,
            email: email ? email : 'test@gmail.com',
            phoneNumber: phoneNumbers,
            birthday,
            gender,
            profilePicture,
            address: addresses,
            language: languages,
            membership: {
                status,
                level,
                points
            },

        }

        // form validation
        const isValid = validateCustomer(customer)
        if (isValid) {
            // alert("customer is valid , add post requiest and move to /customers ")
            if (window.location.pathname.includes("edit")) {
                const id = window.location.pathname.split('/').slice(-1)[0]
                editCustomer(id, customer)
            } else {
                createNewCustomer(customer)
            }
        }

    }
    const handleGenderChange = (e) => {
        setGender(e.target.value)
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    }
    const handleLevelChange = (e) => {
        setLevel(e.target.value)
    }

    const getCustomerDetails = async (id) => {
        try {
            const customers = await getCustomerById(id)
            console.log("customer found daata:", customers.data)
            setFullName(customers.data.fullName)
            setEmail(customers.data.email)
            setPhoneNumbers(customers.data.phoneNumber)
            setAddresses(customers.data.address)
            setBirthday(customers.data.birthday)
            setGender(customers.data.gender)
            setLanguages(customers.data.language)
            setStatus(customers.data.membership.status)
            setLevel(customers.data.membership.level)
            setPoints(customers.data.membership.points)
        } catch (e) {
            console.log("Sorry there was error in fetching customer data", e)
        }

    }

    useEffect(() => {
        // api call for getting customer's data and populating in form

        if (window.location.pathname.includes("edit")) {
            // Editing customer 
            const id = window.location.pathname.split('/').slice(-1)[0]
            console.log("Api call useEffect", id)
            getCustomerDetails(id)
        } else {
            // Adding new customer
            console.log("Adding a new customer")
        }
    }, [])

    return <div>
        Add new Customer<br />
        <Link to={'/customers'}>Back</Link>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <form onSubmit={(e) => handleSubmit(e)} style={{ display: 'flex', border: '1px solid black', padding: '20px', margin: '20px', width: '100%', borderRadius: '16px' }}>
                <div>
                    <label htmlFor="fullname">Full Name*</label>
                    <input id="fullname" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} /><br />
                    <h4 style={{ color: 'red', fontSize: '15px' }}>{fullNameError}</h4>

                    <label htmlFor="email">Email</label>
                    <input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

                    <label htmlFor="phonenumber">Phone Number*</label>
                    <PhoneNumber formFields={phoneNumbers} setFormFields={setPhoneNumbers} phoneNumberError={phoneNumberError} />


                    <label htmlFor="address">Address</label>
                    <Address formFields={addresses} setAddressFields={setAddresses} />
                    <label htmlFor="birthday">Birthday</label>
                    {/* <input id="birthday" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} /><br /> */}
                    <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />



                    <div style={{ display: "flex" }}>
                        Gender:
                        <div onChange={(e) => handleGenderChange(e)}>
                            <input type="radio" id="gender-male" name="gender" value="male" checked={gender === 'male'} /> <label htmlFor="gender-male">Male</label>
                            <br />
                            <input type="radio" id="gender-female" name="gender" value="female" checked={gender === 'female'} /> <label htmlFor="gender-female">Female</label>
                        </div>
                    </div>
                    <br />

                    <label htmlFor="language">Languages Known</label>
                    <Language languages={languages} setLanguages={setLanguages} />
                    <div style={{ border: '1px solid black', }}>
                        Membership:<br />
                        Status:
                        <select onChange={e => handleStatusChange(e)} selected value={status} id="status" name="status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <br />
                        Level:
                        <select onChange={e => handleLevelChange(e)} selected value={level} id="level" name="level">
                            <option value="basic">Basic</option>
                            <option value="platinum">Platinum</option>
                            <option value="gold">Gold</option>
                        </select>
                        <br />
                        <label htmlFor="points">Points</label>
                        <input id="points" value={points} onChange={(e) => setPoints(e.target.value)} />

                        <br />
                    </div>
                    <input type="submit" value={window.location.pathname.includes("edit") ? "Update Customer" : "Add Customer"} />
                </div>
                <div>
                    Profile Picture
                    <div style={{ border: '1px solid black', height: '200px', width: '200px' }}></div>
                    {/* <button>Upload</button> */}
                    <input onChange={e => setProfilePicture(e.target.value)} placeholder="profile picture url" />
                </div>
            </form>
        </div>
    </div>
}

export default AddCustomerForm