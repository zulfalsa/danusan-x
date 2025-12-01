import { usePage, Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AppSidebarLayout from './app/app-sidebar-layout';
import AppHeaderLayout from './app/app-header-layout';

export default function AppLayout({ children }: PropsWithChildren) {
    const page: any = usePage();
    const user = page.props?.auth?.user;
    const role = user?.role; // "seller" / "admin" / "customer"

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Hide Laravel Starter Kit navigation if Seller or Admin */}
            {role !== 'seller' && role !== 'admin' && (
                <AppHeaderLayout />
            )}

            <div className="flex flex-1">
                {role !== 'seller' && role !== 'admin' && (
                    <AppSidebarLayout />
                )}

                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
