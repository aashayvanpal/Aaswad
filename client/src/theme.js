import { createTheme } from '@mui/material/styles'

const typography = {
    // Must match html { font-size } in index.css so MUI rem math is correct
    htmlFontSize: 22,
    fontSize: 22,
    // DM Sans for UI/body, Cormorant Garamond for headings via variant overrides below
    fontFamily: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
    h1: { fontSize: '3.6rem',  fontWeight: 700, fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h2: { fontSize: '3rem',    fontWeight: 700, fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h3: { fontSize: '2.6rem',  fontWeight: 600, fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h4: { fontSize: '2.2rem',  fontWeight: 600, fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h5: { fontSize: '1.9rem',  fontWeight: 700 },
    h6: { fontSize: '1.6rem',  fontWeight: 700 },
    body1:    { fontSize: '1.5rem'  },
    body2:    { fontSize: '1.25rem' },
    caption:  { fontSize: '1rem'    },
    overline: { fontSize: '1rem'    },
    subtitle1: { fontSize: '1.5rem', fontWeight: 500 },
    subtitle2: { fontSize: '1.25rem', fontWeight: 500 },
    button:   { fontSize: '1.25rem', textTransform: 'none' },
}

const sharedComponents = {
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
        styleOverrides: { root: { fontSize: '1.5rem' } },
    },
    MuiInputLabel: {
        styleOverrides: { root: { fontSize: '1.5rem' } },
    },
    MuiChip: {
        styleOverrides: {
            root:  { fontSize: '1.1rem' },
            label: { fontSize: '1.1rem' },
        },
    },
    MuiTooltip: {
        styleOverrides: { tooltip: { fontSize: '1rem' } },
    },
    MuiIconButton: {
        styleOverrides: {
            root:      { padding: '10px' },
            sizeSmall: { padding: '6px'  },
        },
    },
    MuiMenuItem: {
        styleOverrides: { root: { fontSize: '1.5rem' } },
    },
    MuiListItemText: {
        styleOverrides: {
            primary:   { fontSize: '1.5rem'  },
            secondary: { fontSize: '1.25rem' },
        },
    },
    MuiFormHelperText: {
        styleOverrides: { root: { fontSize: '1rem' } },
    },
    MuiAlert: {
        styleOverrides: { message: { fontSize: '1.25rem' } },
    },
    MuiSelect: {
        styleOverrides: { select: { fontSize: '1.5rem' } },
    },
}

// ── Date / Time picker theme overrides (shared structure, colors per-mode) ──
const pickerOverrides = (mode) => {
    const isDark = mode === 'dark'
    const popperBg   = isDark ? '#1a1800' : '#ffffff'
    const dayColor   = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.78)'
    const disabledDay = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'
    const clockBg    = isDark ? 'rgba(201,162,39,0.06)' : 'rgba(201,162,39,0.08)'
    const clockBorder = isDark ? '1px solid rgba(201,162,39,0.15)' : '1px solid rgba(201,162,39,0.25)'
    const toolbarBg  = isDark ? '#100f0b' : '#1a1400'
    const digitalBg  = isDark ? '#1a1800' : '#fafaf6'

    return {
        MuiPickersPopper: {
            styleOverrides: {
                paper: {
                    backgroundColor: popperBg,
                    border: `1px solid ${isDark ? 'rgba(201,162,39,0.25)' : 'rgba(201,162,39,0.35)'}`,
                    borderRadius: '16px',
                    boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.65)' : '0 8px 40px rgba(201,162,39,0.18)',
                    color: isDark ? '#fff' : '#1a1400',
                    width: '750px',
                    overflow: 'hidden',
                },
            },
        },
        MuiPickersLayout: {
            styleOverrides: {
                root: { backgroundColor: popperBg, color: isDark ? '#fff' : '#1a1400' },
                contentWrapper: { backgroundColor: popperBg },
            },
        },
        MuiDateCalendar: {
            styleOverrides: {
                root: {
                    backgroundColor: popperBg,
                    width: '460px',
                    height: 'auto',
                    maxHeight: 'none',
                },
            },
        },
        MuiPickersCalendarHeader: {
            styleOverrides: {
                root:             { color: '#C9A227', paddingLeft: '24px', paddingRight: '16px' },
                label:            { color: '#C9A227', fontWeight: 700, fontSize: '18px' },
                switchViewButton: { color: '#C9A227' },
            },
        },
        MuiPickersArrowSwitcher: {
            styleOverrides: {
                button: {
                    color: 'rgba(201,162,39,0.7)',
                    '&:hover':        { color: '#C9A227', backgroundColor: 'rgba(201,162,39,0.1)' },
                    '&.Mui-disabled': { color: 'rgba(201,162,39,0.2)' },
                },
            },
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: { color: 'rgba(201,162,39,0.55)', fontWeight: 700, fontSize: '15px', width: '60px', margin: 0 },
                slideTransition: { minHeight: '320px' },
            },
        },
        MuiPickerDay: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    color: dayColor,
                    fontSize: '15px',
                    width: '60px',
                    height: '60px',
                    margin: '0px',
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: 'rgba(201,162,39,0.12)', color: '#C9A227' },
                    '&.Mui-selected': {
                        backgroundColor: '#C9A227 !important',
                        color: '#1a1400 !important',
                        fontWeight: 800,
                        '&:hover': { backgroundColor: '#e8c84d !important' },
                    },
                    '&.MuiPickerDay-today:not(.Mui-selected)': {
                        border: '2px solid rgba(201,162,39,0.6)',
                        color: '#C9A227',
                    },
                    '&.Mui-disabled': { color: disabledDay },
                },
            },
        },
        // ── Year picker ──────────────────────────────────────────────────────────
        MuiYearCalendar: {
            styleOverrides: {
                root: {
                    backgroundColor: popperBg,
                    width: '460px',
                    maxHeight: '340px',
                    padding: '8px 16px',
                    overflowY: 'auto',
                },
                button: {
                    width: '96px',
                    height: '40px',
                    margin: '3px',
                    fontSize: '15px',
                    fontWeight: 500,
                    borderRadius: '10px',
                    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(26,20,0,0.75)',
                    '&:hover': { backgroundColor: 'rgba(201,162,39,0.12)', color: '#C9A227' },
                    '&.Mui-selected': {
                        backgroundColor: '#C9A227 !important',
                        color: '#1a1400 !important',
                        fontWeight: 800,
                        '&:hover': { backgroundColor: '#e8c84d !important' },
                    },
                    '&.Mui-disabled': { color: disabledDay },
                },
            },
        },
        // ── Month picker ─────────────────────────────────────────────────────────
        MuiMonthCalendar: {
            styleOverrides: {
                root: {
                    backgroundColor: popperBg,
                    width: '460px',
                    padding: '8px 16px',
                },
                button: {
                    width: '120px',
                    height: '44px',
                    margin: '4px 3px',
                    fontSize: '15px',
                    fontWeight: 500,
                    borderRadius: '10px',
                    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(26,20,0,0.75)',
                    '&:hover': { backgroundColor: 'rgba(201,162,39,0.12)', color: '#C9A227' },
                    '&.Mui-selected': {
                        backgroundColor: '#C9A227 !important',
                        color: '#1a1400 !important',
                        fontWeight: 800,
                        '&:hover': { backgroundColor: '#e8c84d !important' },
                    },
                    '&.Mui-disabled': { color: disabledDay },
                },
            },
        },
        // ── Clock ────────────────────────────────────────────────────────────────
        MuiTimeClock: {
            styleOverrides: { root: { backgroundColor: popperBg } },
        },
        MuiClock: {
            styleOverrides: {
                root:     { backgroundColor: popperBg },
                clock:    { backgroundColor: clockBg, border: clockBorder },
                pin:      { backgroundColor: '#C9A227' },
                amButton: { color: isDark ? '#fff' : '#1a1400', '&.Mui-selected': { backgroundColor: '#C9A227', color: '#1a1400' } },
                pmButton: { color: isDark ? '#fff' : '#1a1400', '&.Mui-selected': { backgroundColor: '#C9A227', color: '#1a1400' } },
            },
        },
        MuiClockNumber: {
            styleOverrides: {
                root: {
                    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                    fontSize: '15px',
                    '&.Mui-selected': { backgroundColor: '#C9A227', color: '#1a1400', fontWeight: 800 },
                },
            },
        },
        MuiClockPointer: {
            styleOverrides: {
                root:  { backgroundColor: '#C9A227' },
                thumb: { backgroundColor: '#C9A227', border: '2px solid #C9A227' },
            },
        },
        // ── Toolbar ──────────────────────────────────────────────────────────────
        MuiPickersToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: toolbarBg,
                    borderBottom: '1px solid rgba(201,162,39,0.2)',
                    '& .MuiTypography-root': { color: '#C9A227' },
                },
            },
        },
        MuiDateTimePickerToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: toolbarBg,
                    '& .MuiTypography-root': { color: 'rgba(201,162,39,0.6)' },
                    '& .Mui-selected': { color: '#C9A227 !important' },
                },
            },
        },
        MuiPickersToolbarButton: {
            styleOverrides: {
                root: { color: 'rgba(201,162,39,0.6)', '&.Mui-selected': { color: '#C9A227' } },
            },
        },
        // ── Dialog actions (Cancel / OK) ─────────────────────────────────────────
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    backgroundColor: popperBg,
                    borderTop: '1px solid rgba(201,162,39,0.15)',
                    '& .MuiButton-root': {
                        color: '#C9A227',
                        fontWeight: 700,
                        '&:hover': { backgroundColor: 'rgba(201,162,39,0.1)' },
                    },
                },
            },
        },
        // ── Digital time scroller ────────────────────────────────────────────────
        MuiMultiSectionDigitalClock: {
            styleOverrides: {
                root: {
                    backgroundColor: digitalBg,
                    borderTop: '1px solid rgba(201,162,39,0.15)',
                    // 750px total − 460px calendar = 290px for time section
                    width: '290px',
                    '& .MuiMultiSectionDigitalClockSection-root': {
                        flex: 1,
                    },
                    '& .MuiMenuItem-root': {
                        color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.7)',
                        fontSize: '17px',
                        justifyContent: 'center',
                        '&:hover':        { backgroundColor: 'rgba(201,162,39,0.1)', color: '#C9A227' },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(201,162,39,0.18)',
                            color: '#C9A227',
                            fontWeight: 700,
                        },
                    },
                },
            },
        },
        // ── Tabs (Date / Time toggle) ─────────────────────────────────────────────
        MuiDateTimePickerTabs: {
            styleOverrides: {
                root: {
                    backgroundColor: isDark ? '#100f0b' : '#f5edd6',
                    borderBottom: `1px solid ${isDark ? 'rgba(201,162,39,0.15)' : 'rgba(201,162,39,0.25)'}`,
                    '& .MuiTab-root': {
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                        '&.Mui-selected': { color: '#C9A227' },
                    },
                    '& .MuiTabs-indicator': { backgroundColor: '#C9A227' },
                },
            },
        },
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dark theme
// ─────────────────────────────────────────────────────────────────────────────
export const darkTheme = createTheme({
    typography,
    palette: {
        mode: 'dark',
        primary:    { main: '#C9A227', light: '#e8c84d', dark: '#9a7a1a' },
        background: { default: '#0f0e0b', paper: '#1a1800' },
        text:       { primary: 'rgba(255,255,255,0.87)', secondary: 'rgba(255,255,255,0.55)' },
        divider:    'rgba(201,162,39,0.15)',
    },
    components: {
        ...sharedComponents,
        ...pickerOverrides('dark'),
    },
})

// ─────────────────────────────────────────────────────────────────────────────
// Light theme — warm ivory + gold
// ─────────────────────────────────────────────────────────────────────────────
export const lightTheme = createTheme({
    typography,
    palette: {
        mode: 'light',
        primary:    { main: '#C9A227', light: '#e8c84d', dark: '#9a7a1a' },
        background: { default: '#E8DCC8', paper: '#FFFDF7' },
        text:       { primary: '#1a1400', secondary: 'rgba(26,20,0,0.58)' },
        divider:    'rgba(201,162,39,0.2)',
    },
    components: {
        ...sharedComponents,
        ...pickerOverrides('light'),
        MuiTableCell: {
            styleOverrides: {
                root: { fontSize: '1.5rem', padding: '14px 18px', color: '#1a1400' },
                head: {
                    fontSize: '1.25rem', fontWeight: 700, color: '#3d2e00',
                    backgroundColor: 'rgba(201,162,39,0.07)',
                },
                sizeSmall: { fontSize: '1.25rem', padding: '10px 14px' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
                outlined: { borderColor: 'rgba(201,162,39,0.22)' },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { boxShadow: '0 1px 4px rgba(201,162,39,0.1), 0 0 0 1px rgba(201,162,39,0.1)' },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: { backgroundColor: '#ffffff' },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: 'rgba(201,162,39,0.18)' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root:  { fontSize: '1.1rem' },
                label: { fontSize: '1.1rem' },
                outlined: { borderColor: 'rgba(201,162,39,0.35)' },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: { backgroundColor: '#ffffff', color: '#1a1400' },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: { backgroundColor: '#ffffff' },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&:hover': { backgroundColor: 'rgba(201,162,39,0.07)' },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(201,162,39,0.12)',
                        '&:hover': { backgroundColor: 'rgba(201,162,39,0.16)' },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: { fontSize: '1.5rem' },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: { borderColor: 'rgba(201,162,39,0.3)' },
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(201,162,39,0.55)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C9A227' },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: { fontSize: '1.5rem', color: 'rgba(26,20,0,0.5)', '&.Mui-focused': { color: '#C9A227' } },
            },
        },
        MuiAlert: {
            styleOverrides: {
                message: { fontSize: '1.25rem' },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: { backgroundColor: '#C9A227' },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: 'rgba(26,20,0,0.45)',
                    '&.Mui-selected': { color: '#C9A227' },
                },
            },
        },
    },
})

// Legacy default export — used as fallback / before context hydrates
export default darkTheme
