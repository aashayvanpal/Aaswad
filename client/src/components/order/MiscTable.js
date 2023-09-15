const MiscTable = ({ miscItems, editMiscTable, deleteMiscTable }) => {
    return <>
        <hr />
        <div>Extras</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>

            <table style={{ "borderCollapse": "collapse", "border": "2px solid black", width: "50%" }}>
                <thead style={{ "border": "2px solid black" }}>
                    <tr>
                        <td>Particulars</td>
                        <td>Rate</td>
                    </tr>
                </thead>
                <tbody>
                    {miscItems.map((item, index) => <tr key={index}>
                        <td>{item.particular}</td>
                        <td>{item.rate}</td>
                    </tr>)}
                </tbody>
            </table>
            <button onClick={deleteMiscTable}>Delete Table</button>
            <button onClick={editMiscTable}>Edit Table</button>
        </div>
    </>
}

export default MiscTable