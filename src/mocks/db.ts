import type {Product, ProductCategory, ProductStatus} from '../features/products/types';

const CATEGORIES: ProductCategory[] = ['electronics', 'clothing', 'food', 'books', 'toys'];
const STATUSES: ProductStatus[] = ['active', 'draft', 'archived'];
const WORDS = ['Nova', 'Aero', 'Lumen', 'Pulse', 'Vertex', 'Quartz', 'Orbit', 'Delta', 'Echo', 'Prism'];

function mulberry32(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function seed(count = 10_000): Product[] {
    const rnd = mulberry32(42);
    const pick = <T, >(a: T[]) => a[Math.floor(rnd() * a.length)];

    return Array.from({length: count}, (_, i) => {
        const category = pick(CATEGORIES);
        return {
            id: `p_${i + 1}`,
            name: `${pick(WORDS)} ${pick(WORDS)} ${i + 1}`,
            sku: `SKU-${String(i + 1).padStart(6, '0')}`,
            category,
            status: pick(STATUSES),
            price: Math.round(rnd() * 900_000 + 10_000),
            stock: Math.floor(rnd() * 500),
            weight: category === 'electronics' ? +(rnd() * 5 + 0.1).toFixed(2) : +(rnd() * 3).toFixed(2),
            description: '',
            updatedAt: new Date(Date.now() - i * 60_000).toISOString(),
        } satisfies Product;
    });
}

export const db = {products: seed()};
