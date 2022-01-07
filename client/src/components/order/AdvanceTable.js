const AdvanceTable = (props) => {
    return <>
        <hr />
        <table style={{ "borderCollapse": "collapse", "border": "2px solid black", width: "50%", marginLeft: "auto", marginRight: "auto" }}>
            <thead style={{ "border": "2px solid black" }}>
                <tr>
                    <td>Advance Payment</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{props.advanceAmount}</td>
                </tr>
            </tbody>
        </table>
    </>
}

export default AdvanceTable