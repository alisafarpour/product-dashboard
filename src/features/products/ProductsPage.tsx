import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import {useProductFilters} from './hooks/useProductFilters';
import {useProducts} from './api/useProducts';
import {useDeleteProduct} from './api/useProductMutations';
import {useNavigateKeepingSearch} from '../../shared/hooks/useNavigateKeepingSearch';
import {ProductsToolbar} from './components/ProductsToolbar';
import {ProductsTable} from './components/ProductsTable';
import {ConfirmDialog} from './components/ConfirmDialog.tsx';
import type {Product} from './types';

export function ProductsPage() {
    const {filters, setFilters, reset} = useProductFilters();
    const {data, isLoading, isFetching, isError, error, refetch} = useProducts(filters);
    const removeProduct = useDeleteProduct();
    const go = useNavigateKeepingSearch();

    const [deleting, setDeleting] = useState<Product | null>(null);

    return (
        <Container maxWidth="xl" sx={{py: 4}}>
            <Stack direction="row" spacing={1.5} sx={{mb: 3}}>
                <Typography variant="h4" sx={{fontWeight: 800}}>مدیریت محصولات</Typography>
                {data && <Chip size="small" label={`${data.total.toLocaleString('fa-IR')} محصول`}/>}
            </Stack>

            <ProductsToolbar
                filters={filters}
                onChange={setFilters}
                onReset={reset}
                onAdd={() => go('/products/new')}
            />

            {isError ? (
                <Alert severity="error" action={<Button onClick={() => refetch()}>تلاش مجدد</Button>}>
                    خطا در دریافت محصولات: {(error as Error).message}
                </Alert>
            ) : (
                <Paper elevation={0} sx={{borderRadius: 3, overflow: 'hidden'}}>
                    <ProductsTable
                        rows={data?.items ?? []}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        onEdit={(p) => go(`/products/${p.id}/edit`)}
                        onDelete={setDeleting}
                    />
                    <TablePagination
                        component="div"
                        count={data?.total ?? 0}
                        page={filters.page - 1}
                        rowsPerPage={filters.pageSize}
                        rowsPerPageOptions={[25, 50, 100, 200]}
                        onPageChange={(_, p) => setFilters({page: p + 1})}
                        onRowsPerPageChange={(e) => setFilters({pageSize: Number(e.target.value)})}
                        labelRowsPerPage="تعداد در صفحه"
                    />
                </Paper>
            )}

            <Outlet/>

            <ConfirmDialog
                open={!!deleting}
                title="حذف محصول"
                message={`آیا از حذف «${deleting?.name}» مطمئن هستید؟`}
                onCancel={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting) removeProduct.mutate(deleting.id);
                    setDeleting(null);
                }}
            />
        </Container>
    );
}
