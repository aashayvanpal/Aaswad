// Routing url inside a function
import React from 'react'
import { Link } from 'react-router-dom'
import { Tr, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

export default function DisplayList(props) {
    console.log('props', props)
    const { name, id, i, display } = props
    console.log('checkbox value here', display)
    return (
        <Tr className="listing-table" key={i}>
            <Td className="listing-table">{i + 1}</Td>
            <Td className="listing-table"><Link to={`/items/show/${id}`}>{name}</Link></Td>
            <Td className="listing-table">
                <Link to={`/items/edit/${id}`}>
                    <button className="button-color4" onClick={() => {
                        props.updateItem(id)
                    }}>
                        Update
                </button>
                </Link>
            </Td>
            <Td className="listing-table">


                <input className="checkbox" type="checkbox" checked={display} onChange={() => {
                    console.log('checkbox toggle for menu card clicked!')
                    console.log('name', name)
                    console.log('checkbox value before:', display)
                    console.log('props:', props)
                    props.updateCheckbox(id)

                }} />


            </Td>
            <Td className="listing-table">
                <button className="button-color5" onClick={() => {
                    props.deleteItem(id)
                }}>Delete</button>
            </Td>

        </Tr>
    )
}

