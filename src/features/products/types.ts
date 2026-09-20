export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'books' | 'toys';

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: ProductCategory;
    status: ProductStatus;
    price: number;
    stock: number;
    weight: number;
    description?: string;
    updatedAt: string;
}

export interface ProductQuery {
    q: string;
    status: ProductStatus | 'all';
    category: ProductCategory | 'all';
    page: number;
    pageSize: number;
}

export interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number }
export type ProductInput = Omit<Product, 'id' | 'updatedAt'>;
