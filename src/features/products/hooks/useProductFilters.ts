import {useCallback, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import type {ProductQuery} from '../types';

const DEFAULTS: ProductQuery = {q: '', status: 'all', category: 'all', page: 1, pageSize: 50};

export function useProductFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo<ProductQuery>(() => ({
        q: searchParams.get('q') ?? DEFAULTS.q,
        status: (searchParams.get('status') as ProductQuery['status']) ?? DEFAULTS.status,
        category: (searchParams.get('category') as ProductQuery['category']) ?? DEFAULTS.category,
        page: Math.max(1, Number(searchParams.get('page')) || DEFAULTS.page),
        pageSize: Number(searchParams.get('pageSize')) || DEFAULTS.pageSize,
    }), [searchParams]);

    const setFilters = useCallback((patch: Partial<ProductQuery>) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            const merged = {...patch, ...(patch.page === undefined && {page: 1})};
            for (const [key, value] of Object.entries(merged)) {
                const isDefault = String(value) === String(DEFAULTS[key as keyof ProductQuery]);
                if (value === '' || value == null || isDefault) next.delete(key);
                else next.set(key, String(value));
            }
            return next;
        }, {replace: true})
    }, [setSearchParams]);

    const reset = useCallback(() => setSearchParams(new URLSearchParams(), {replace: true}), [setSearchParams]);

    return {filters, setFilters, reset};
}
