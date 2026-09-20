import { useCallback } from 'react';
import { useLocation, useNavigate, type NavigateOptions } from 'react-router-dom';

export function useNavigateKeepingSearch() {
    const navigate = useNavigate();
    const { search } = useLocation();

    return useCallback(
        (pathname: string, options?: NavigateOptions) => navigate({ pathname, search }, options),
        [navigate, search]
    );
}
