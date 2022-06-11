const TranportTable = (props) => {
    return <>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <table style={{ "borderCollapse": "collapse", "border": "2px solid black", width: "50%" }}>
                <thead style={{ "border": "2px solid black" }}>
                    <tr>
                        <td>Transport</td>
                        <td>Rate</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.medium}</td>
                        <td>{props.rate}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => {
                console.log('delete Transport table clicked')
                props.deleteTable()
            }}>Delete</button>
        </div>
    </>
}

export default TranportTable