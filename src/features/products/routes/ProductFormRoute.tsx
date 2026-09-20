import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useProduct} from '../api/useProduct';
import {useNavigateKeepingSearch} from '../../../shared/hooks/useNavigateKeepingSearch';
import {useToast} from '../../../shared/toast/useToast';
import {ProductFormDialog} from '../components/ProductFormDialog';

export function ProductFormRoute() {
    const {id} = useParams();
    const go = useNavigateKeepingSearch();
    const toast = useToast();
    const {data: product, isLoading, isError} = useProduct(id);

    const close = () => go('/products', {replace: true});

    useEffect(() => {
        if (isError) {
            toast.error('محصول مورد نظر یافت نشد');
            close();
        }
    }, [isError]);

    if (id && isLoading) return null;

    return <ProductFormDialog open product={product ?? null} onClose={close}/>;
}
