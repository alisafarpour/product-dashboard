import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from './products.api';
import { productKeys } from './keys';
import type { Paginated, Product } from '../types';

export function useProduct(id?: string) {
    const qc = useQueryClient();

    return useQuery({
        queryKey: productKeys.detail(id!),
        queryFn: () => productsApi.getById(id!),
        enabled: Boolean(id),
        // اگر محصول از قبل در یکی از صفحات کش‌شدهٔ لیست هست، بدون ریکوئست از آن استفاده کن
        initialData: () => {
            for (const [, page] of qc.getQueriesData<Paginated<Product>>({ queryKey: productKeys.lists() })) {
                const hit = page?.items.find(p => p.id === id);
                if (hit) return hit;
            }
            return undefined;
        },
    });
}
