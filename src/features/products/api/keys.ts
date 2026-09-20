import type { ProductQuery } from '../types';

export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (f: ProductQuery) => [...productKeys.lists(), f] as const,
    detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};
