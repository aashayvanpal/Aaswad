import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    typography: {
        // Must match html { font-size } in index.css so MUI rem math is correct
        htmlFontSize: 22,
        fontSize: 18,
        fontFamily: [
            '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
            '"Helvetica Neue"', 'Arial', 'sans-serif',
        ].join(','),
        h1: { fontSize: '2.8rem',  fontWeight: 700 },
        h2: { fontSize: '2.4rem',  fontWeight: 700 },
        h3: { fontSize: '2rem',    fontWeight: 700 },
        h4: { fontSize: '1.75rem', fontWeight: 700 },
        h5: { fontSize: '1.5rem',  fontWeight: 700 },
        h6: { fontSize: '1.25rem', fontWeight: 700 },
        body1:   { fontSize: '1rem'  },
        body2:   { fontSize: '0.9rem' },
        caption: { fontSize: '0.8rem' },
        button:  { fontSize: '1rem', textTransform: 'none' },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: { fontSize: '1rem',  padding: '14px 16px' },
                head: { fontSize: '1rem',  fontWeight: 700 },
                sizeSmall: { fontSize: '0.9rem', padding: '10px 14px' },
            },
        },
        MuiButton: {
            styleOverrides: {
                root:        { padding: '10px 22px' },
                sizeSmall:   { fontSize: '0.85rem', padding: '6px 14px' },
                sizeLarge:   { fontSize: '1.1rem',  padding: '12px 28px' },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: { fontSize: '1rem' },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: { fontSize: '1rem' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root:      { fontSize: '0.85rem' },
                label:     { fontSize: '0.85rem' },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { fontSize: '0.85rem' },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root:      { padding: '10px' },
                sizeSmall: { padding: '6px'  },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: { fontSize: '1rem' },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary:   { fontSize: '1rem'  },
                secondary: { fontSize: '0.85rem' },
            },
        },
    },
})

export default theme
