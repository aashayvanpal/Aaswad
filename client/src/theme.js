import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    typography: {
        // Must match html { font-size } in index.css so MUI rem math is correct
        htmlFontSize: 22,
        fontSize: 22,
        fontFamily: [
            '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
            '"Helvetica Neue"', 'Arial', 'sans-serif',
        ].join(','),
        // Scale: 1rem = 22px on 2560×1440, scaling down via index.css media queries
        h1: { fontSize: '3.6rem',  fontWeight: 700 },
        h2: { fontSize: '3rem',    fontWeight: 700 },
        h3: { fontSize: '2.6rem',  fontWeight: 700 },
        h4: { fontSize: '2.2rem',  fontWeight: 700 },
        h5: { fontSize: '1.9rem',  fontWeight: 700 },
        h6: { fontSize: '1.6rem',  fontWeight: 700 },
        body1:    { fontSize: '1.5rem'  },
        body2:    { fontSize: '1.25rem' },
        caption:  { fontSize: '1rem'    },
        overline: { fontSize: '1rem'    },
        subtitle1: { fontSize: '1.5rem', fontWeight: 500 },
        subtitle2: { fontSize: '1.25rem', fontWeight: 500 },
        button:   { fontSize: '1.25rem', textTransform: 'none' },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root:      { fontSize: '1.5rem',  padding: '14px 18px' },
                head:      { fontSize: '1.25rem', fontWeight: 700 },
                sizeSmall: { fontSize: '1.25rem', padding: '10px 14px' },
            },
        },
        MuiButton: {
            styleOverrides: {
                root:      { padding: '10px 24px' },
                sizeSmall: { fontSize: '1rem',   padding: '6px 16px' },
                sizeLarge: { fontSize: '1.4rem', padding: '12px 32px' },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: { fontSize: '1.5rem' },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: { fontSize: '1.5rem' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root:  { fontSize: '1.1rem' },
                label: { fontSize: '1.1rem' },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { fontSize: '1rem' },
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
                root: { fontSize: '1.5rem' },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary:   { fontSize: '1.5rem'  },
                secondary: { fontSize: '1.25rem' },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: { fontSize: '1rem' },
            },
        },
        MuiAlert: {
            styleOverrides: {
                message: { fontSize: '1.25rem' },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: { fontSize: '1.5rem' },
            },
        },
    },
})

export default theme
