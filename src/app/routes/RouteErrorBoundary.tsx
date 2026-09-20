import {isRouteErrorResponse, useNavigate, useRouteError} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export function RouteErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    const title = isRouteErrorResponse(error) ? `خطای ${error.status}` : 'خطای غیرمنتظره';
    const detail = isRouteErrorResponse(error)
        ? error.statusText
        : error instanceof Error ? error.message : 'مشکلی پیش آمد.';

    return (
        <Container maxWidth="sm" sx={{py: 10, textAlign: 'center'}}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{fontWeight: 800}}>{title}</Typography>
                <Alert severity="error" sx={{width: '100%'}}>{detail}</Alert>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => navigate('/products', {replace: true})}>
                        بازگشت به لیست
                    </Button>
                    <Button onClick={() => location.reload()}>بارگذاری مجدد</Button>
                </Stack>
            </Stack>
        </Container>
    );
}
