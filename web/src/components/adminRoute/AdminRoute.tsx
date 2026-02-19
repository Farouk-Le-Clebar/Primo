import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { checkAdminStatus } from '../../requests/UserRequests';

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
                id: "auth-error",
            });
        }
    }, [isError]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>
        );
    }

    return isError ? <Navigate to="/" /> : <Outlet />;
};

export default AdminRoute;