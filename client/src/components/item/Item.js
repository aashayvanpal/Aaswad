// Routing url inside a function
import React from 'react'
import { Link } from 'react-router-dom'
import { Tr, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import deleteIcon from '../../images/delete-icon.png'
import updateIcon from '../../images/update-icon.jpg'

export default function DisplayList(props) {
    // console.log('props', props)
    const { name, id, i, display } = props
    // console.log('checkbox value here', display)
    return (
        <Tr className="listing-table" key={i}>
            <Td className="listing-table">{i + 1}</Td>
            <Td className="listing-table"><Link to={`/items/show/${id}`}><h3>{name}</h3></Link></Td>
            <Td className="listing-table">
                <Link to={`/items/edit/${id}`}>
                    <button className="button-color4"
                        style={{ width: "100%",fontWeight:"bold" }}
                    >
                        <img src={updateIcon} alt="" height="30px" width="30px" />
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
                <button className="button-color5"
                    style={{ width: "100%" }}
                    onClick={() => {
                        props.deleteItem(id)
                    }}>
                    <img src={deleteIcon} alt="" height="30px" width="35px" />
                    Delete
                </button>
            </Td>

        </Tr>
    )
}

