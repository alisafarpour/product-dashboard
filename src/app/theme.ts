import { createTheme, alpha } from '@mui/material/styles';

export const theme = createTheme({
    direction: 'rtl',
    palette: {
        mode: 'light',
        primary: { main: '#4f46e5' },
        background: { default: '#f6f7fb', paper: '#ffffff' },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Vazirmatn, Inter, system-ui, sans-serif' },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({ border: `1px solid ${alpha(theme.palette.divider, 0.6)}` }),
            },
        },
        MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
        MuiTableCell: { styleOverrides: { root: { borderBottomStyle: 'dashed' } } },
    },
});
