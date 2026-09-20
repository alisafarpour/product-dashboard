import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {productsApi} from './products.api';
import {productKeys} from './keys';
import type {ProductQuery} from '../types';

export function useProducts(filters: ProductQuery) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: ({signal}) => productsApi.list(filters, signal),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });
}
