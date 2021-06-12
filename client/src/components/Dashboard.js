import React from 'react'

export default class Dashboard extends React.Component {
    constructor() {
        super()

    }

    render() {
        return (
            <div>
                <h1>This is dashboard</h1>
                <h1>Total orders - </h1>
                <h1>Completed orders -</h1>
                <h1>Approve orders -</h1>
                <h1>Confirmed orders -</h1>
            </div>
        )
    }
}