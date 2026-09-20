import {useEffect, useMemo} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {createProductSchema, clearSkuCache, CATEGORIES, STATUSES} from '../schemas/product.schema';
import {useCreateProduct, useUpdateProduct} from '../api/useProductMutations';
import type {Product, ProductInput} from '../types';

const EMPTY = {
    name: '', sku: '', category: '' as never, status: 'draft' as const,
    price: '' as never, stock: '' as never, weight: '' as never, description: '',
};

export function ProductFormDialog({open, product, onClose}: {
    open: boolean; product?: Product | null; onClose: () => void;
}) {
    const isEdit = Boolean(product);
    const schema = useMemo(() => createProductSchema(product?.id), [product?.id]);
    const create = useCreateProduct();
    const update = useUpdateProduct();

    const {control, handleSubmit, reset, formState: {errors, isSubmitting, isValidating}} = useForm({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: EMPTY,
    });

    useEffect(() => {
        if (!open) return;
        clearSkuCache();
        reset(product ? {...product, description: product.description ?? ''} as never : EMPTY);
    }, [open, product, reset]);

    const onSubmit = handleSubmit(async (values) => {
        const payload = values as unknown as ProductInput;
        if (isEdit && product) await update.mutateAsync({id: product.id, data: payload});
        else await create.mutateAsync(payload);
        onClose();
    });

    const field = (name: keyof typeof EMPTY, label: string, props = {}) => (
        <Controller
            name={name as never}
            control={control}
            render={({field: f}) => (
                <TextField
                    {...f} label={label} fullWidth size="small"
                    error={!!errors[name]} helperText={errors[name]?.message as string}
                    {...props}
                />
            )}
        />
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
                slotProps={{
                    paper: {
                        sx: {borderRadius: 3}
                    }
                }}
        >
            <DialogTitle sx={{fontWeight: 700}}>
                {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
            </DialogTitle>
            <Divider/>

            <DialogContent>
                <Grid container spacing={2} sx={{mt: 0}}>
                    <Grid size={{xs: 12, sm: 7}}>{field('name', 'نام محصول')}</Grid>
                    <Grid size={{xs: 12, sm: 7}}>
                        {field('sku', 'SKU', {
                            InputProps: {
                                endAdornment: isValidating && (
                                    <InputAdornment position="end"><CircularProgress size={16}/></InputAdornment>
                                ),
                            },
                        })}
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        {field('category', 'دسته‌بندی', {
                            select: true,
                            children: CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>),
                        })}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        {field('status', 'وضعیت', {
                            select: true,
                            children: STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>),
                        })}
                    </Grid>

                    <Grid size={{xs: 12, sm: 4}}>{field('price', 'قیمت (تومان)', {type: 'number'})}</Grid>
                    <Grid size={{xs: 12, sm: 4}}>{field('stock', 'موجودی', {type: 'number'})}</Grid>
                    <Grid size={{xs: 12, sm: 4}}>{field('weight', 'وزن (kg)', {
                        type: 'number',
                        inputProps: {step: 0.01}
                    })}</Grid>

                    <Grid size={{xs: 12}}>{field('description', 'توضیحات', {multiline: true, rows: 3})}</Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 2}}>
                <Stack direction="row" spacing={1}>
                    <Button onClick={onClose} color="inherit">انصراف</Button>
                    <Button
                        variant="contained" onClick={onSubmit}
                        disabled={isSubmitting || isValidating}
                        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit"/> : null}
                    >
                        {isEdit ? 'ذخیره تغییرات' : 'ایجاد محصول'}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}
