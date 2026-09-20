import {useMutation, useQueryClient, type QueryClient} from '@tanstack/react-query';
import {productsApi} from './products.api';
import {productKeys} from './keys';
import {useToast} from '../../../shared/toast/useToast';
import type {Paginated, Product, ProductInput} from '../types';

type ListSnapshot = [readonly unknown[], Paginated<Product> | undefined][];

function patchAllLists(qc: QueryClient, fn: (page: Paginated<Product>) => Paginated<Product>) {
    qc.setQueriesData<Paginated<Product>>({queryKey: productKeys.lists()}, old => (old ? fn(old) : old));
}

const replaceItem = (item: Product) => (page: Paginated<Product>) => ({
    ...page,
    items: page.items.map(p => (p.id === item.id ? item : p)),
});

export function useUpdateProduct() {
    const qc = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({id, data}: { id: string; data: Partial<ProductInput> }) => productsApi.update(id, data),

        onMutate: async ({id, data}) => {
            await qc.cancelQueries({queryKey: productKeys.lists()});          // 1) جلوگیری از race
            const snapshot: ListSnapshot = qc.getQueriesData({queryKey: productKeys.lists()}); // 2) عکس فوری برای rollback
            patchAllLists(qc, page => ({                                         // 3) آپدیت خوش‌بینانه
                ...page,
                items: page.items.map(p => (p.id === id ? {...p, ...data} : p)),
            }));
            return {snapshot};
        },

        onError: (error, _vars, ctx) => {
            ctx?.snapshot.forEach(([key, value]) => qc.setQueryData(key, value)); // 4) ROLLBACK
            toast.error(`ویرایش ناموفق بود: ${error.message}`);
        },

        onSuccess: (serverProduct) => {
            patchAllLists(qc, replaceItem(serverProduct));
            qc.setQueryData(productKeys.detail(serverProduct.id), serverProduct);
            toast.success('محصول با موفقیت ویرایش شد');
        },
    });
}

export function useDeleteProduct() {
    const qc = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (id: string) => productsApi.remove(id),

        onMutate: async (id) => {
            await qc.cancelQueries({queryKey: productKeys.lists()});
            const snapshot: ListSnapshot = qc.getQueriesData({queryKey: productKeys.lists()});
            patchAllLists(qc, page => ({
                ...page,
                items: page.items.filter(p => p.id !== id),
                total: Math.max(0, page.total - 1), // شمارنده هم باید خوش‌بینانه درست بماند
            }));
            return {snapshot};
        },

        onError: (error, _id, ctx) => {
            ctx?.snapshot.forEach(([key, value]) => qc.setQueryData(key, value));
            toast.error(`حذف ناموفق بود: ${error.message}`);
        },

        onSuccess: () => toast.success('محصول حذف شد'),
    });
}

export function useCreateProduct() {
    const qc = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: ProductInput) => productsApi.create(data),

        onMutate: async (data) => {
            await qc.cancelQueries({queryKey: productKeys.lists()});
            const snapshot: ListSnapshot = qc.getQueriesData({queryKey: productKeys.lists()});
            const optimistic: Product = {
                ...data,
                id: `temp_${crypto.randomUUID()}`,
                updatedAt: new Date().toISOString()
            };
            patchAllLists(qc, page =>
                page.page === 1 ? {...page, items: [optimistic, ...page.items], total: page.total + 1} : page
            );
            return {snapshot, tempId: optimistic.id};
        },

        onError: (error, _vars, ctx) => {
            ctx?.snapshot.forEach(([key, value]) => qc.setQueryData(key, value));
            toast.error(`ایجاد ناموفق بود: ${error.message}`);
        },

        onSuccess: (created, _vars, ctx) => {
            patchAllLists(qc, page => ({
                ...page,
                items: page.items.map(p => (p.id === ctx?.tempId ? created : p)),
            }));
            qc.setQueryData(productKeys.detail(created.id), created);
            toast.success('محصول ایجاد شد');
        },
    });
}
