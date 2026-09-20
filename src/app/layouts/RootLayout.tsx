import {Suspense} from 'react';
import {NavLink, Outlet, ScrollRestoration} from 'react-router-dom';
import {useIsFetching, useIsMutating} from '@tanstack/react-query';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Inventory2Icon from '@mui/icons-material/Inventory2Outlined';

const NAV = [
    {to: '/products', label: 'محصولات'},
    {to: '/reports', label: 'گزارش‌ها'}
];

export function RootLayout() {
    const busy = useIsFetching() + useIsMutating() > 0;

    return (
        <Box sx={{minHeight: '100vh', bgcolor: 'background.default'}}>
            <AppBar position="sticky" color="inherit" elevation={0}
                    sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Toolbar sx={{gap: 2}}>
                    <Inventory2Icon color="primary"/>
                    <Typography variant="h6" sx={{mr: 2, fontWeight: 800}}>Product Dashboard</Typography>

                    {NAV.map(item => (
                        <Button
                            key={item.to}
                            component={NavLink}
                            to={item.to}
                            color="inherit"
                            sx={{
                                '&.active': {color: 'primary.main', bgcolor: 'action.selected'},
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Toolbar>

                <Box sx={{height: 3}}>{busy && <LinearProgress sx={{height: 3}}/>}</Box>
            </AppBar>

            <Suspense fallback={<Container sx={{py: 6}}><Skeleton height={56}/><Skeleton height={420}/></Container>}>
                <Outlet/>
            </Suspense>

            <ScrollRestoration/>
        </Box>
    );
}
