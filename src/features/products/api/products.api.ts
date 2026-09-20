import type {Paginated, Product, ProductInput, ProductQuery} from '../types';

async function http<T>(input: string, init?: RequestInit): Promise<T> {
    const res = await fetch(input, {headers: {'Content-Type': 'application/json'}, ...init});
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Request failed with ${res.status}`);
    }
    return res.status === 204 ? (undefined as T) : res.json();
}

export const productsApi = {
    list: (f: ProductQuery, signal?: AbortSignal) =>
        http<Paginated<Product>>(
            `/api/products?${new URLSearchParams({
                q: f.q, status: f.status, category: f.category,
                page: String(f.page), pageSize: String(f.pageSize),
            })}`, {signal}),

    isSkuAvailable: (sku: string, excludeId?: string) =>
        http<{ available: boolean }>(
            `/api/products/sku-available?${new URLSearchParams({sku, ...(excludeId && {excludeId})})}`
        ).then(r => r.available),

    create: (data: ProductInput) => http<Product>('/api/products', {method: 'POST', body: JSON.stringify(data)}),
    update: (id: string, data: Partial<ProductInput>) =>
        http<Product>(`/api/products/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    remove: (id: string) => http<void>(`/api/products/${id}`, {method: 'DELETE'}),
    getById: (id: string) => http<Product>(`/api/products/${id}`),
};
