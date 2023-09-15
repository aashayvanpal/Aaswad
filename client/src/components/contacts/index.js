import contacts from '../../json/contacts.json'
// {
//     "name": "Sunil/Sunil2",
//     "phonenumber": [
//         8792532335,
//         8618587834
//     ],
//     "type": "Water",
//     "notes": "Paniwala",
//     "address": ""
// },
const Contacts = () => {
    return <div>
        Contacts
        <table>
            <thead>
                <tr>
                    <td>Slno</td>
                    <td>Name</td>
                    <td>Phonenumber</td>
                    <td>type</td>
                    <td>notes</td>
                    <td>address</td>
                </tr>
            </thead>
            <tbody>
                {contacts.map((contact, index) => <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{contact.name}</td>
                    <td>{Array.isArray(contact.phonenumber) ? <>{contact.phonenumber.map(num => <div>{num}</div>)}</> : <>{contact.phonenumber}</>}</td>
                    <td>{contact.type}</td>
                    <td>{contact.notes}</td>
                    <td>{contact.address}</td>
                </tr>)}
            </tbody>
        </table>
    </div>
}

export default Contacts