import {z} from 'zod';
import {productsApi} from '../api/products.api';

const skuCache = new Map<string, boolean>();

async function isSkuAvailable(sku: string, excludeId?: string) {
    const key = `${sku}|${excludeId ?? ''}`;
    if (!skuCache.has(key)) skuCache.set(key, await productsApi.isSkuAvailable(sku, excludeId));
    return skuCache.get(key)!;
}

export const clearSkuCache = () => skuCache.clear();

export const CATEGORIES = ['electronics', 'clothing', 'food', 'books', 'toys'] as const;
export const STATUSES = ['active', 'draft', 'archived'] as const;

export function createProductSchema(editingId?: string) {
    return z
        .object({
            name: z.string().trim().min(3, 'حداقل ۳ کاراکتر').max(80, 'حداکثر ۸۰ کاراکتر'),
            sku: z.string().trim().toUpperCase()
                .regex(/^[A-Z0-9-]{4,20}$/, 'فقط حروف بزرگ، عدد و خط تیره (۴ تا ۲۰ کاراکتر)'),
            category: z.enum(CATEGORIES, {message: 'دسته‌بندی الزامی است'}),
            status: z.enum(STATUSES, {message: 'وضعیت الزامی است'}),
            price: z.coerce.number({message: 'عدد وارد کنید'}).positive('قیمت باید بزرگ‌تر از صفر باشد').max(1_000_000_000),
            stock: z.coerce.number().int('عدد صحیح وارد کنید').min(0, 'نمی‌تواند منفی باشد'),
            weight: z.coerce.number().min(0, 'نمی‌تواند منفی باشد'),
            description: z.string().max(500, 'حداکثر ۵۰۰ کاراکتر').optional().or(z.literal('')),
        })
        .superRefine((data, ctx) => {
            if (data.category === 'electronics' && data.weight <= 0) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['weight'],
                    message: 'برای دستهٔ Electronics وزن باید بزرگ‌تر از صفر باشد'
                });
            }
            if (data.status === 'active' && data.stock === 0) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['stock'],
                    message: 'محصول Active نمی‌تواند موجودی صفر داشته باشد'
                });
            }
        })
        .superRefine(async (data, ctx) => {
            if (!/^[A-Z0-9-]{4,20}$/.test(data.sku)) return;
            if (!(await isSkuAvailable(data.sku, editingId))) {
                ctx.addIssue({code: 'custom', path: ['sku'], message: 'این SKU قبلاً ثبت شده است'});
            }
        });
}

export type ProductFormValues = z.input<ReturnType<typeof createProductSchema>>;
