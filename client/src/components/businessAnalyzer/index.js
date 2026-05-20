import { useEffect, useRef, useState } from "react"
import IncomeModal from "./modals/incomeModal"
import ExpenseModal from "./modals/expenseModal"
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

const FSA_SUPPORTED = 'showOpenFilePicker' in window

const FS = '2.5rem'
const FS_HEADING = '3rem'
const FS_SECTION = '2.75rem'

const BusinessAnalyzer = () => {
    const [incomeItems, setIncomeItems] = useState([])
    const [expenseItems, setExpenseItems] = useState([])
    const [fileHandle, setFileHandle] = useState(null)
    const [fileName, setFileName] = useState('')
    const [dirty, setDirty] = useState(false)
    const fileInputRef = useRef(null)

    const totalIncome = incomeItems.reduce((acc, i) => acc + i.amount, 0)
    const totalExpense = expenseItems.reduce((acc, i) => acc + i.amount, 0)
    const result = totalIncome - totalExpense

    // Restore last session from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('business')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setIncomeItems(data.income || [])
                setExpenseItems(data.expense || [])
                setDirty(true)
            } catch (e) { }
        }
    }, [])

    // Auto-save working copy to localStorage
    useEffect(() => {
        localStorage.setItem('business', JSON.stringify({ income: incomeItems, expense: expenseItems }))
    }, [incomeItems, expenseItems])

    const confirmDiscard = () => {
        if (!dirty || (incomeItems.length === 0 && expenseItems.length === 0)) return true
        return window.confirm('You have unsaved changes. Discard and continue?')
    }

    const handleNew = () => {
        if (!confirmDiscard()) return
        setIncomeItems([])
        setExpenseItems([])
        setFileHandle(null)
        setFileName('')
        setDirty(false)
        localStorage.removeItem('business')
    }

    const loadData = (data, handle, name) => {
        setIncomeItems(data.income || [])
        setExpenseItems(data.expense || [])
        setFileHandle(handle || null)
        setFileName(name || '')
        setDirty(false)
    }

    const handleOpen = async () => {
        if (!confirmDiscard()) return
        if (FSA_SUPPORTED) {
            try {
                const [handle] = await window.showOpenFilePicker({
                    types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }]
                })
                const file = await handle.getFile()
                const text = await file.text()
                const data = JSON.parse(text)
                loadData(data, handle, handle.name.replace(/\.json$/i, ''))
            } catch (e) {
                if (e.name !== 'AbortError') console.error(e)
            }
        } else {
            fileInputRef.current.click()
        }
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result)
                loadData(data, null, file.name.replace(/\.json$/i, ''))
            } catch (err) {
                console.error(err)
            }
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const handleSave = async () => {
        const data = JSON.stringify({ income: incomeItems, expense: expenseItems }, null, 2)
        if (fileHandle && FSA_SUPPORTED) {
            try {
                const writable = await fileHandle.createWritable()
                await writable.write(data)
                await writable.close()
                setDirty(false)
            } catch (e) {
                console.error(e)
            }
        } else {
            await handleSaveAs()
        }
    }

    const handleSaveAs = async () => {
        const data = JSON.stringify({ income: incomeItems, expense: expenseItems }, null, 2)
        if (FSA_SUPPORTED) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: `${fileName || 'profit-loss'}.json`,
                    types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }]
                })
                const writable = await handle.createWritable()
                await writable.write(data)
                await writable.close()
                setFileHandle(handle)
                setFileName(handle.name.replace(/\.json$/i, ''))
                setDirty(false)
            } catch (e) {
                if (e.name !== 'AbortError') console.error(e)
            }
        } else {
            const name = fileName || 'profit-loss'
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${name}.json`
            a.click()
            URL.revokeObjectURL(url)
            setDirty(false)
        }
    }

    const removeIncomeItem = (index) => {
        setIncomeItems(incomeItems.filter((_, i) => i !== index))
        setDirty(true)
    }

    const removeExpenseItem = (index) => {
        setExpenseItems(expenseItems.filter((_, i) => i !== index))
        setDirty(true)
    }

    const onAddIncome = (items) => {
        setIncomeItems(items)
        setDirty(true)
    }

    const onAddExpense = (items) => {
        setExpenseItems(items)
        setDirty(true)
    }

    return (
        <Box sx={{ p: 1 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography fontWeight="bold" sx={{ fontSize: FS_HEADING }}>Profit & Loss</Typography>
                    {fileName ? (
                        <Chip
                            icon={<InsertDriveFileIcon sx={{ fontSize: '1.6rem !important' }} />}
                            label={dirty ? `${fileName} •` : fileName}
                            color={dirty ? 'warning' : 'default'}
                            variant="outlined"
                            sx={{ fontSize: '1.6rem', height: 'auto', py: 0.5 }}
                        />
                    ) : (dirty && (incomeItems.length > 0 || expenseItems.length > 0)) ? (
                        <Chip label="Unsaved" color="warning" variant="outlined" sx={{ fontSize: '1.6rem', height: 'auto', py: 0.5 }} />
                    ) : null}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title="Start a new sheet">
                        <Button variant="outlined" startIcon={<NoteAddIcon sx={{ fontSize: '2rem !important' }} />} onClick={handleNew} sx={{ fontSize: FS }}>
                            New
                        </Button>
                    </Tooltip>
                    <Tooltip title="Open a saved JSON file from your laptop">
                        <Button variant="outlined" startIcon={<FolderOpenIcon sx={{ fontSize: '2rem !important' }} />} onClick={handleOpen} sx={{ fontSize: FS }}>
                            Open
                        </Button>
                    </Tooltip>
                    <Tooltip title={fileHandle ? 'Save back to the same file' : 'Save to a file on your laptop'}>
                        <Button variant="contained" startIcon={<SaveIcon sx={{ fontSize: '2rem !important' }} />} onClick={handleSave} sx={{ fontSize: FS }}>
                            Save
                        </Button>
                    </Tooltip>
                    <Tooltip title="Save to a new file">
                        <Button variant="outlined" startIcon={<SaveAsIcon sx={{ fontSize: '2rem !important' }} />} onClick={handleSaveAs} sx={{ fontSize: FS }}>
                            Save As
                        </Button>
                    </Tooltip>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileInputChange} style={{ display: 'none' }} />
                </Box>
            </Box>

            {/* Income + Expense panels */}
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Income */}
                <Paper sx={{ flex: 1, p: 1.5, borderTop: '6px solid #4caf50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography color="success.main" fontWeight="bold" sx={{ fontSize: FS_SECTION }}>Income</Typography>
                        <IncomeModal incomeItems={incomeItems} setIncomeItems={onAddIncome} />
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    {incomeItems.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center', fontSize: FS }}>
                            No income entries yet
                        </Typography>
                    ) : (
                        <Table sx={{ '& .MuiTableCell-root': { py: 0.5 } }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: FS, width: 60 }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: FS }}>Particular</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: FS }} align="right">Amount</TableCell>
                                    <TableCell sx={{ width: 60 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {incomeItems.map((item, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell sx={{ fontSize: FS }}>{i + 1}</TableCell>
                                        <TableCell sx={{ fontSize: FS }}>{item.particular}</TableCell>
                                        <TableCell sx={{ fontSize: FS }} align="right">₹{item.amount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell padding="none">
                                            <IconButton color="error" onClick={() => removeIncomeItem(i)}>
                                                <DeleteIcon sx={{ fontSize: '2rem' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <Divider sx={{ mt: 1, mb: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography fontWeight="bold" color="success.main" sx={{ fontSize: FS }}>
                            Total: ₹{totalIncome.toLocaleString('en-IN')}
                        </Typography>
                    </Box>
                </Paper>

                {/* Expense */}
                <Paper sx={{ flex: 1, p: 1.5, borderTop: '6px solid #f44336' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography color="error.main" fontWeight="bold" sx={{ fontSize: FS_SECTION }}>Expense</Typography>
                        <ExpenseModal expenseItems={expenseItems} setExpenseItems={onAddExpense} />
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    {expenseItems.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center', fontSize: FS }}>
                            No expense entries yet
                        </Typography>
                    ) : (
                        <Table sx={{ '& .MuiTableCell-root': { py: 0.5 } }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: FS, width: 60 }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: FS }}>Particular</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: FS }} align="right">Amount</TableCell>
                                    <TableCell sx={{ width: 60 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expenseItems.map((item, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell sx={{ fontSize: FS }}>{i + 1}</TableCell>
                                        <TableCell sx={{ fontSize: FS }}>{item.particular}</TableCell>
                                        <TableCell sx={{ fontSize: FS }} align="right">₹{item.amount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell padding="none">
                                            <IconButton color="error" onClick={() => removeExpenseItem(i)}>
                                                <DeleteIcon sx={{ fontSize: '2rem' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <Divider sx={{ mt: 1, mb: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography fontWeight="bold" color="error.main" sx={{ fontSize: FS }}>
                            Total: ₹{totalExpense.toLocaleString('en-IN')}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Result summary */}
            <Paper
                sx={{
                    mt: 1, p: 1.5, textAlign: 'center',
                    bgcolor: result >= 0 ? '#e8f5e9' : '#ffebee',
                    border: `2px solid ${result >= 0 ? '#4caf50' : '#f44336'}`
                }}
            >
                <Typography fontWeight="bold" color={result >= 0 ? 'success.main' : 'error.main'} sx={{ fontSize: FS_HEADING }}>
                    {result >= 0
                        ? `Net Profit: ₹${result.toLocaleString('en-IN')}`
                        : `Net Loss: ₹${Math.abs(result).toLocaleString('en-IN')}`
                    }
                </Typography>
            </Paper>
        </Box>
    )
}

export default BusinessAnalyzer
