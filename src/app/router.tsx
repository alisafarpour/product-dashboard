import {createBrowserRouter, Navigate} from 'react-router-dom';
import {RootLayout} from './layouts/RootLayout';
import {RouteErrorBoundary} from './routes/RouteErrorBoundary';
import NotFoundPage from './routes/NotFoundPage';
import {queryClient} from './queryClient';
import {productKeys} from '../features/products/api/keys';
import {productsApi} from '../features/products/api/products.api';

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <RootLayout/>,
            errorElement: <RouteErrorBoundary/>,
            children: [
                {index: true, element: <Navigate to="/products" replace/>},

                {
                    path: 'products',
                    lazy: async () => {
                        const {ProductsPage} = await import('../features/products/ProductsPage');
                        return {Component: ProductsPage};
                    },
                    children: [
                        {
                            path: 'new',
                            lazy: async () => {
                                const {ProductFormRoute} = await import('../features/products/routes/ProductFormRoute');
                                return {Component: ProductFormRoute};
                            },
                        },
                        {
                            path: ':id/edit',
                            loader: async ({params}) => {
                                await queryClient.ensureQueryData({
                                    queryKey: productKeys.detail(params.id!),
                                    queryFn: () => productsApi.getById(params.id!),
                                });
                                return null;
                            },
                            lazy: async () => {
                                const {ProductFormRoute} = await import('../features/products/routes/ProductFormRoute');
                                return {Component: ProductFormRoute};
                            },
                        },
                    ],
                },

                {path: '*', element: <NotFoundPage/>},
            ],
        },
    ],
);
