import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

const NotFoundPage = () => {
    return (
        <Container>
            <Stack spacing={2}>
                <Typography variant="h2" sx={{fontWeight: 900}} color="text.disabled">۴۰۴</Typography>
                <Typography variant="h6">صفحه‌ای که دنبالش بودید پیدا نشد.</Typography>
                <Button component={Link} href="/products" variant="contained">رفتن به محصولات</Button>
            </Stack>
        </Container>
    )
}

export default NotFoundPage