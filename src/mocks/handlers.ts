import {http, HttpResponse, delay} from 'msw';
import {db} from './db';
import type {Product} from '../features/products/types';

const FAIL_RATE = 0.25;
const shouldFail = () => Math.random() < FAIL_RATE;

export const handlers = [
    http.get('/api/products', async ({request}) => {
        await delay(400);
        const url = new URL(request.url);
        const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
        const status = url.searchParams.get('status') ?? 'all';
        const category = url.searchParams.get('category') ?? 'all';
        const page = Number(url.searchParams.get('page') ?? 1);
        const pageSize = Number(url.searchParams.get('pageSize') ?? 50);

        let items = db.products;
        if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
        if (status !== 'all') items = items.filter(p => p.status === status);
        if (category !== 'all') items = items.filter(p => p.category === category);

        const total = items.length;
        const start = (page - 1) * pageSize;
        return HttpResponse.json({items: items.slice(start, start + pageSize), total, page, pageSize});
    }),

    http.get('/api/products/sku-available', async ({request}) => {
        await delay(500);
        const url = new URL(request.url);
        const sku = (url.searchParams.get('sku') ?? '').toUpperCase();
        const excludeId = url.searchParams.get('excludeId');
        const taken = db.products.some(p => p.sku.toUpperCase() === sku && p.id !== excludeId);
        return HttpResponse.json({available: !taken});
    }),


    http.get('/api/products/:id', async ({params}) => {
        await delay(250);
        const found = db.products.find(p => p.id === params.id);
        return found
            ? HttpResponse.json(found)
            : HttpResponse.json({message: 'Not found'}, {status: 404});
    }),

    http.post('/api/products', async ({request}) => {
        await delay(700);
        const body = (await request.json()) as Omit<Product, 'id' | 'updatedAt'>;
        if (db.products.some(p => p.sku.toUpperCase() === body.sku.toUpperCase()))
            return HttpResponse.json({message: 'SKU already exists'}, {status: 409});

        const created: Product = {...body, id: `p_${crypto.randomUUID()}`, updatedAt: new Date().toISOString()};
        db.products.unshift(created);
        return HttpResponse.json(created, {status: 201});
    }),

    http.patch('/api/products/:id', async ({params, request}) => {
        await delay(700);
        if (shouldFail()) return HttpResponse.json({message: 'Server exploded 💥'}, {status: 500});

        const idx = db.products.findIndex(p => p.id === params.id);
        if (idx === -1) return HttpResponse.json({message: 'Not found'}, {status: 404});

        const patch = (await request.json()) as Partial<Product>;
        db.products[idx] = {...db.products[idx], ...patch, updatedAt: new Date().toISOString()};
        return HttpResponse.json(db.products[idx]);
    }),

    http.delete('/api/products/:id', async ({params}) => {
        await delay(700);
        if (shouldFail()) return HttpResponse.json({message: 'Delete failed'}, {status: 500});
        db.products = db.products.filter(p => p.id !== params.id);
        return new HttpResponse(null, {status: 204});
    }),
];
