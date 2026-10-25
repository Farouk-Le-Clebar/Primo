import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { checkAdminStatus } from '../../requests/UserRequests';
import PanelFallback from '../lazyPage/PanelFallback';
import { ROUTES } from '../../constants/routes';

const AdminRoute = () => {
    const { isLoading, isError } = useQuery({
        queryKey: ['checkAdminStatus'],
        queryFn: checkAdminStatus,
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            toast.error("Accès refusé : droits administrateur requis.", {
                id: "admin-error",
            });
        }
    }, [isError]);

    if (isLoading) return <PanelFallback />;

    return isError ? <Navigate to={ROUTES.map} replace /> : <Outlet />;
};

export default AdminRoute;