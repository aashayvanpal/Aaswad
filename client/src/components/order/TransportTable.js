const TranportTable = (props) => {
    return <>
        <hr />
        <table style={{ "borderCollapse": "collapse", "border": "2px solid black", width: "50%", marginLeft: "auto", marginRight: "auto" }}>
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
    </>
}

export default TranportTable