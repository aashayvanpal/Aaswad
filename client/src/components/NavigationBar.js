import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import DateRangeIcon from '@mui/icons-material/DateRange'
import EventIcon from '@mui/icons-material/Event'
import ViewListIcon from '@mui/icons-material/ViewList'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import PeopleIcon from '@mui/icons-material/People'
import SpaIcon from '@mui/icons-material/Spa'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ContactsIcon from '@mui/icons-material/Contacts'
import BarChartIcon from '@mui/icons-material/BarChart'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

const SIDEBAR_BG = '#100f0b'
const GOLD = '#C9A227'

const GROUPS = [
    {
        label: 'Overview',
        items: [
            { label: 'Home',      to: '/',          icon: <HomeIcon /> },
            { label: 'Dashboard', to: '/dashboard',  icon: <DashboardIcon /> },
        ],
    },
    {
        label: 'Orders',
        items: [
            { label: 'Orders',       to: '/orders',      icon: <ReceiptIcon /> },
            { label: 'Multi Orders', to: '/multiOrders', icon: <DateRangeIcon /> },
            { label: 'Event Orders', to: '/eventOrders', icon: <EventIcon /> },
            { label: 'Bulk Orders',  to: '/bulk-orders', icon: <ViewListIcon /> },
        ],
    },
    {
        label: 'Catalogue',
        items: [
            { label: 'Menu',        to: '/menu',        icon: <MenuBookIcon /> },
            { label: 'Items',       to: '/items',       icon: <RestaurantMenuIcon /> },
            { label: 'Ingredients', to: '/ingredients', icon: <SpaIcon /> },
        ],
    },
    {
        label: 'CRM',
        items: [
            { label: 'Customers', to: '/customers', icon: <PeopleIcon /> },
            { label: 'Queries',   to: '/queries',   icon: <QuestionAnswerIcon /> },
            { label: 'Contacts',  to: '/contacts',  icon: <ContactsIcon /> },
        ],
    },
    {
        label: 'Other',
        items: [
            { label: 'Calendar',      to: '/Calender',    icon: <CalendarMonthIcon /> },
            { label: 'Deals',         to: '/deals',       icon: <LocalOfferIcon /> },
            { label: 'Profit & Loss', to: '/profit-loss', icon: <BarChartIcon /> },
        ],
    },
]

export default function NavigationBar({ onClose, collapsed = false }) {
    const location = useLocation()

    return (
        <Box sx={{
            width: collapsed ? 64 : 240,
            minHeight: '100%',
            bgcolor: SIDEBAR_BG,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(201,162,39,0.15)',
            transition: 'width 0.22s cubic-bezier(.4,0,.2,1)',
            overflow: 'hidden',
            flexShrink: 0,
        }}>
            {/* Sidebar header row */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                px: collapsed ? 0 : 2,
                py: 1.5,
                borderBottom: '1px solid rgba(201,162,39,0.12)',
                minHeight: 56,
            }}>
                {!collapsed && (
                    <Typography sx={{
                        color: GOLD,
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        letterSpacing: 2.5,
                        textTransform: 'uppercase',
                    }}>
                        Aaswad
                    </Typography>
                )}
                {onClose && (
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{ color: 'rgba(201,162,39,0.55)', '&:hover': { color: GOLD } }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                )}
            </Box>

            {/* Nav groups */}
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                py: 1,
                '&::-webkit-scrollbar': { width: 3 },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(201,162,39,0.18)', borderRadius: 2 },
            }}>
                {GROUPS.map((group, gi) => (
                    <React.Fragment key={group.label}>
                        {gi > 0 && <Divider sx={{ borderColor: 'rgba(201,162,39,0.07)', my: 0.5 }} />}
                        {!collapsed && (
                            <Typography sx={{
                                color: 'rgba(201,162,39,0.35)',
                                fontSize: '0.58rem',
                                fontWeight: 800,
                                letterSpacing: 1.8,
                                textTransform: 'uppercase',
                                px: 2,
                                pt: gi === 0 ? 1 : 1.5,
                                pb: 0.5,
                            }}>
                                {group.label}
                            </Typography>
                        )}
                        <List dense disablePadding>
                            {group.items.map(item => {
                                const active = location.pathname === item.to ||
                                    (item.to !== '/' && location.pathname.startsWith(item.to))

                                const btn = (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={onClose}
                                        style={{ textDecoration: 'none', display: 'block' }}
                                    >
                                        <ListItemButton
                                            sx={{
                                                mx: collapsed ? 0.5 : 1,
                                                mb: 0.25,
                                                borderRadius: '8px',
                                                minHeight: 38,
                                                px: collapsed ? 1 : 1.5,
                                                justifyContent: collapsed ? 'center' : 'flex-start',
                                                bgcolor: active ? 'rgba(201,162,39,0.14)' : 'transparent',
                                                '&:hover': { bgcolor: 'rgba(201,162,39,0.09)' },
                                            }}
                                        >
                                            <ListItemIcon sx={{
                                                minWidth: collapsed ? 0 : 34,
                                                color: active ? GOLD : 'rgba(255,255,255,0.4)',
                                                '& svg': { fontSize: '1.1rem' },
                                            }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            {!collapsed && (
                                                <ListItemText
                                                    primary={item.label}
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            fontSize: '0.8rem',
                                                            fontWeight: active ? 700 : 400,
                                                            color: active ? GOLD : 'rgba(255,255,255,0.65)',
                                                            whiteSpace: 'nowrap',
                                                        },
                                                    }}
                                                />
                                            )}
                                            {active && !collapsed && (
                                                <Box sx={{
                                                    width: 3,
                                                    height: 14,
                                                    borderRadius: 2,
                                                    bgcolor: GOLD,
                                                    ml: 'auto',
                                                    flexShrink: 0,
                                                }} />
                                            )}
                                        </ListItemButton>
                                    </Link>
                                )

                                return collapsed ? (
                                    <Tooltip key={item.to} title={item.label} placement="right">
                                        {btn}
                                    </Tooltip>
                                ) : btn
                            })}
                        </List>
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    )
}
