import React from 'react'
import {
  Box, Card, CardContent, Divider, Typography, Chip, Avatar, List,
  ListItem, ListItemIcon, ListItemText
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import PhoneIcon from '@mui/icons-material/Phone'
import PersonIcon from '@mui/icons-material/Person'
import UpdateIcon from '@mui/icons-material/Update'
import { appVersion } from '../config/main.client.js'

const GOLD = '#C9A227'
const GOLD_BG = 'rgba(201,162,39,0.08)'
const GOLD_BORDER = 'rgba(201,162,39,0.28)'

export default function SettingsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: GOLD }}>
        Settings
      </Typography>

      <Card variant="outlined" sx={{ borderColor: GOLD_BORDER, borderRadius: 3, bgcolor: GOLD_BG, mb: 3 }}>
        <CardContent>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            App Info
          </Typography>
          <Divider sx={{ mb: 2, borderColor: GOLD_BORDER }} />
          <List disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <UpdateIcon sx={{ color: GOLD }} />
              </ListItemIcon>
              <ListItemText
                primary="App Version"
                secondary={
                  <Chip label={appVersion} size="small" sx={{
                    mt: 0.5, bgcolor: GOLD, color: '#3d2e00', fontWeight: 700, fontSize: '0.75rem'
                  }} />
                }
              />
            </ListItem>

            <Divider sx={{ borderColor: GOLD_BORDER, my: 1 }} />

            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon sx={{ color: GOLD }} />
              </ListItemIcon>
              <ListItemText primary="Created By" secondary="Aashay S Vanpal" />
            </ListItem>

            <Divider sx={{ borderColor: GOLD_BORDER, my: 1 }} />

            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PhoneIcon sx={{ color: GOLD }} />
              </ListItemIcon>
              <ListItemText primary="Support Contact" secondary="9743419673" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderColor: GOLD_BORDER, borderRadius: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: GOLD, color: '#3d2e00', width: 48, height: 48, fontWeight: 700 }}>
            AC
          </Avatar>
          <Box>
            <Typography fontWeight={700}>Aaswad Caterers</Typography>
            <Typography variant="body2" color="text.secondary">
              Order management system
            </Typography>
          </Box>
          <InfoIcon sx={{ color: GOLD_BORDER, ml: 'auto' }} />
        </CardContent>
      </Card>
    </Box>
  )
}
