import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {ThemeProvider} from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CssBaseline from '@mui/material/CssBaseline';
import {theme} from './theme';
import {useToastStore} from '../shared/toast/useToast';

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: 1, refetchOnWindowFocus: false}},
});

function ToastHost() {
    const {toasts, dismiss} = useToastStore();
    return (
        <>
            {toasts.map(t => (
                <Snackbar key={t.id} open autoHideDuration={4000} onClose={() => dismiss(t.id)}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                    <Alert severity={t.severity} variant="filled" onClose={() => dismiss(t.id)}>{t.message}</Alert>
                </Snackbar>
            ))}
        </>
    );
}

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <QueryClientProvider client={queryClient}>
                {children}
                <ToastHost/>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
