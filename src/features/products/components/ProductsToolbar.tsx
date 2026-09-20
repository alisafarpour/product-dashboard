import {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {useDebouncedValue} from '../../../shared/hooks/useDebouncedValue';
import {CATEGORIES, STATUSES} from '../schemas/product.schema';
import type {ProductQuery} from '../types';

export function ProductsToolbar({filters, onChange, onReset, onAdd}: {
    filters: ProductQuery;
    onChange: (p: Partial<ProductQuery>) => void;
    onReset: () => void;
    onAdd: () => void;
}) {
    const [term, setTerm] = useState(filters.q);
    const debounced = useDebouncedValue(term, 450);

    useEffect(() => {
        setTerm(filters.q);
    }, [filters.q]);

    useEffect(() => {
        if (debounced !== filters.q) onChange({q: debounced});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    return (
        <Paper elevation={0} sx={{p: 2, mb: 2, borderRadius: 3}}>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={1.5}>
                <TextField
                    value={term} onChange={(e) => setTerm(e.target.value)}
                    placeholder="جستجو بر اساس نام یا SKU…" size="small" sx={{flex: 1, minWidth: 220}}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start"><SearchIcon
                                fontSize="small"/></InputAdornment>
                        }
                    }}
                />

                <TextField select size="small" label="وضعیت" sx={{minWidth: 150}}
                           value={filters.status} onChange={(e) => onChange({status: e.target.value as never})}>
                    <MenuItem value="all">همه</MenuItem>
                    {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>

                <TextField select size="small" label="دسته‌بندی" sx={{minWidth: 170}}
                           value={filters.category} onChange={(e) => onChange({category: e.target.value as never})}>
                    <MenuItem value="all">همه</MenuItem>
                    {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>

                <Tooltip title="پاک‌کردن فیلترها">
                    <IconButton onClick={onReset}><RestartAltIcon/></IconButton>
                </Tooltip>

                <Button variant="contained" startIcon={<AddIcon/>} onClick={onAdd} sx={{whiteSpace: 'nowrap'}}>
                    محصول جدید
                </Button>
            </Stack>
        </Paper>
    );
}
