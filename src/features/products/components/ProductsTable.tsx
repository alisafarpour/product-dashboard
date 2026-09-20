import {forwardRef} from 'react';
import {TableVirtuoso, type TableComponents} from 'react-virtuoso';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import type {Product} from '../types';

const STATUS_COLOR = {active: 'success', draft: 'warning', archived: 'default'} as const;

const VirtuosoComponents: TableComponents<Product> = {
    Scroller: forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} elevation={0}/>),
    Table: (props) => <Table {...props} size="small" sx={{borderCollapse: 'separate', tableLayout: 'fixed'}}/>,
    TableHead: forwardRef((props, ref) => <TableHead {...props} ref={ref}/>),
    TableRow: ({item, ...props}) => (
        <TableRow
            {...props}
            hover
            sx={{
                opacity: item.id.startsWith('temp_') ? 0.55 : 1, // آیتم optimistic در حال ثبت
                transition: 'opacity .2s, background-color .2s',
            }}
        />
    ),
    TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref}/>),
};

const COLUMNS = [
    {key: 'name', label: 'نام محصول', width: '28%'},
    {key: 'sku', label: 'SKU', width: '14%'},
    {key: 'category', label: 'دسته', width: '12%'},
    {key: 'status', label: 'وضعیت', width: '12%'},
    {key: 'price', label: 'قیمت', width: '14%', align: 'left' as const},
    {key: 'stock', label: 'موجودی', width: '10%'},
    {key: 'actions', label: '', width: '10%'},
];

export function ProductsTable({rows, isLoading, isFetching, onEdit, onDelete}: {
    rows: Product[]; isLoading: boolean; isFetching: boolean;
    onEdit: (p: Product) => void; onDelete: (p: Product) => void;
}) {
    if (isLoading) {
        return (
            <Paper elevation={0} sx={{p: 2}}>
                {Array.from({length: 12}).map((_, i) => (
                    <Skeleton key={i} height={44} sx={{borderRadius: 1, mb: 0.5}}/>
                ))}
            </Paper>
        );
    }

    if (!rows.length) {
        return (
            <Paper elevation={0} sx={{py: 10, textAlign: 'center'}}>
                <Typography variant="h6" color="text.secondary">محصولی یافت نشد</Typography>
                <Typography variant="body2" color="text.disabled">فیلترها را تغییر دهید یا محصول جدیدی اضافه
                    کنید.</Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{
            position: 'relative',
            height: 'calc(100vh - 290px)',
            opacity: isFetching ? 0.7 : 1,
            transition: 'opacity .2s'
        }}>
            <TableVirtuoso
                data={rows}
                components={VirtuosoComponents}
                fixedHeaderContent={() => (
                    <TableRow sx={{bgcolor: 'background.paper'}}>
                        {COLUMNS.map(c => (
                            <TableCell key={c.key} width={c.width} align={c.align ?? 'inherit'}
                                       sx={{fontWeight: 700, color: 'text.secondary'}}>
                                {c.label}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
                itemContent={(_, p) => (
                    <>
                        <TableCell sx={{fontWeight: 600}}>{p.name}</TableCell>
                        <TableCell><code>{p.sku}</code></TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                            <Chip size="small" label={p.status} color={STATUS_COLOR[p.status]} variant="outlined"/>
                        </TableCell>
                        <TableCell>{p.price.toLocaleString('fa-IR')}</TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={0.5}>
                                <IconButton size="small" onClick={() => onEdit(p)}><EditIcon
                                    fontSize="small"/></IconButton>
                                <IconButton size="small" color="error" onClick={() => onDelete(p)}><DeleteIcon
                                    fontSize="small"/></IconButton>
                            </Stack>
                        </TableCell>
                    </>
                )}
            />
        </Box>
    );
}
