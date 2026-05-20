import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const ConfirmDialog = ({ open, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) => (
  <Dialog open={!!open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="error" variant="text">{cancelText}</Button>
      <Button onClick={onConfirm} color="warning" variant="contained">{confirmText}</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
