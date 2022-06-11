import React, { useState, useEffect } from 'react'
import axios from '../config/axios.js'

// only admin should be able to reply to the query
// render like to be provided to customer to view all FAQ

const Queries = () => {

    const [queries, setQueries] = useState([])

    useEffect(() => {
        console.log('inside useState hook!')
        // get all queries and render
        axios.get('/contactus', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Data : ', response.data)
                const queries = response.data
                console.log('Queries after request :', queries)
                setQueries(queries)
            })
            .catch(err => {
                console.log(err)
            })


    }, [])

    return (
        <div>
            <h1>Frequently Asked Queries</h1>
            <div>
                {queries.map(query => {
                    return (<div>
                        <h3>Question : {query.message}</h3>
                        <h4>Answer :
                            {query.reply ? query.reply : 'This question has not been answered yet...'}
                        </h4>
                        <hr />
                    </div>
                    )
                })}
            </div>
        </div >
    )
}

export default Queries