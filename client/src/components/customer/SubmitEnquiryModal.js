import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useAppTheme } from '../../context/ThemeContext'

const SubmitEnquiryModal = ({ isOpen, closeModal }) => {
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

    const contentBg = isDark ? '#1a1800' : '#fffbee'
    const bodyText = isDark ? 'rgba(255,255,255,0.78)' : '#3d2e00'
    const mutedText = isDark ? 'rgba(255,255,255,0.45)' : '#7a6010'

    return (
        <Dialog
            open={!!isOpen}
            onClose={closeModal}
            slotProps={{ paper: { sx: { borderRadius: '20px', border: '2px solid #C9A227', overflow: 'hidden', minWidth: 320 } } }}
        >
            <DialogTitle sx={{ bgcolor: '#C9A227', py: 2, px: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#3d2e00', textAlign: 'center' }}>
                    Enquiry Submitted
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: contentBg, pt: 3, pb: 1, textAlign: 'center' }}>
                <Box sx={{ color: '#C9A227', mb: 1.5 }}>
                    <TaskAltIcon sx={{ fontSize: 56 }} />
                </Box>
                <Typography variant="body1" sx={{ color: bodyText, fontWeight: 500 }}>
                    Your enquiry has been submitted successfully.
                </Typography>
                <Typography variant="body2" sx={{ color: mutedText, mt: 0.5 }}>
                    We will get back to you shortly!
                </Typography>
            </DialogContent>
            <DialogActions sx={{ bgcolor: contentBg, pb: 2.5, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={closeModal}
                    sx={{
                        bgcolor: '#C9A227', color: '#3d2e00 !important', fontWeight: 700,
                        px: 4, borderRadius: '10px',
                        '&:hover': { bgcolor: '#e8c84d', color: '#3d2e00 !important' },
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SubmitEnquiryModal
