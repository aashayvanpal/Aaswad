import { useEffect, useState } from "react"
import IncomeModal from "./modals/incomeModal"
import ExpenseModal from "./modals/expenseModal"

const BusinessAnalyzer = () => {
    const [incomeItems, setIncomeItems] = useState([])
    const [expenseItems, setExpenseItems] = useState([])
    const [jsonData, setJsonData] = useState(null);
    const calculateTotal = (myArr) => {
        const totalAmount = myArr.reduce(function (acc, item) { return acc + item.amount }, 0)
        return totalAmount
    }

    const calculateResult = () => {
        const result = calculateTotal(incomeItems) - calculateTotal(expenseItems)
        return result
    }

    const clearAll = () => {
        setIncomeItems([])
        setExpenseItems([])
        localStorage.removeItem('business')
    }
    const saveAll = () => {
        // grab income
        // grab expense
        const business = { income: incomeItems, expense: expenseItems }
        // set to LS
        localStorage.setItem('business', JSON.stringify(business))
    }
    const checkLSNSetState = () => {
        const business = JSON.parse(localStorage.getItem('business'))
        if (business) {
            setIncomeItems(business.income)
            setExpenseItems(business.expense)
        }
    }

    const removeIncomeItem = (index) => {
        const newIncomItems = incomeItems.filter((item, i) => i != index)
        setIncomeItems(newIncomItems)

        const business = { income: newIncomItems, expense: expenseItems }
        // set to LS
        localStorage.setItem('business', JSON.stringify(business))
    }
    const removeExpenseItem = (index) => {
        const newExpenseItems = expenseItems.filter((item, i) => i != index)
        setExpenseItems(newExpenseItems)

        const business = { income: incomeItems, expense: newExpenseItems }
        // set to LS
        localStorage.setItem('business', JSON.stringify(business))
    }

    const saveAsJSON = () => {
        const fileName = prompt('inside save as json')
        const business = localStorage.getItem('business')
        const blob = new Blob([business], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`; // Specify the file name here
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the object URL to release memory
        URL.revokeObjectURL(url);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            // No file selected, do nothing
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                localStorage.setItem('business', JSON.stringify(jsonData))
                checkLSNSetState()

                // setJsonData(jsonData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        reader.readAsText(file);
    };


    useEffect(() => {
        checkLSNSetState()
    }, [])
    return <div>

        <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '20px' }}>Profit and Loss Calculator </h3>

        <br />
        <div style={{ padding: '20px' }}>
            <div>
                <button onClick={clearAll}>Clear All</button>
                <button onClick={saveAll}>Save</button>
                <button onClick={saveAsJSON}>SaveAsJSON</button>
                <input type="file" accept=".json" onChange={handleFileChange} />
                {jsonData ? (
                    <div>
                        <h3>JSON Data:</h3>
                        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                    </div>
                ) : null}

            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', }}>
                    <div style={{ backgroundColor: '#79ea86', width: '50%', padding: '20px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <h4 style={{ textAlign: 'center' }}>Income section</h4>

                            <IncomeModal
                                // refresh={refresh}
                                // setRefresh={setRefresh}
                                incomeItems={incomeItems}
                                setIncomeItems={setIncomeItems}
                                buttonLabel="Add Income" />
                        </div>
                        <table style={{ width: '100%', margin: '20px' }}>
                            <thead>
                                <tr>
                                    <td>Slno</td>
                                    <td>Particular</td>
                                    <td>Amount</td>
                                </tr>
                            </thead>
                            <tbody>
                                {incomeItems.map((item, index) => <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.particular}</td>
                                    <td>{item.amount}<button onClick={() => removeIncomeItem(index)}>X</button></td>
                                </tr>
                                )}

                            </tbody>
                        </table>
                        <div style={{ width: '100%' }}>Total Income - {calculateTotal(incomeItems)}</div>


                    </div>
                    <div style={{ backgroundColor: '#e75757', width: '50%', padding: '20px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <h4 style={{ textAlign: 'center' }}>Expense section</h4>

                            <ExpenseModal
                                // refresh={refresh}
                                // setRefresh={setRefresh}
                                expenseItems={expenseItems}
                                setExpenseItems={setExpenseItems}
                                buttonLabel="Add Expense" />
                        </div>
                        <table style={{ width: '100%', margin: '20px' }}>
                            <thead>
                                <tr>
                                    <td>Slno</td>
                                    <td>Particular</td>
                                    <td>Amount</td>
                                </tr>
                            </thead>
                            <tbody>
                                {expenseItems.map((item, index) => <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.particular}</td>
                                    <td>{item.amount}<button onClick={() => removeExpenseItem(index)}>X</button></td>
                                </tr>
                                )}

                            </tbody>
                        </table>
                        <div style={{ width: '100%' }}>Total Expense - {calculateTotal(expenseItems)}</div>

                    </div>
                </div>
                <div>
                    {calculateResult() >= 0 ?
                        <div style={{ fontWeight: 'bold', border: '2px solid black', padding: '20px', width: '100%', backgroundColor: '#79ea86', textAlign: 'center', fontSize: '24px' }}>Total Profit - {calculateResult()}</div>

                        :
                        <div style={{ fontWeight: 'bold', border: '2px solid black', padding: '20px', width: '100%', backgroundColor: '#e75757', textAlign: 'center', fontSize: '24px' }}>Total Loss  {calculateResult()}</div>

                    }
                </div>
            </div>
        </div >
    </div >
}
export default BusinessAnalyzer