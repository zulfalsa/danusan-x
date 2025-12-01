import { usePage, Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import AppSidebarLayout from './app/app-sidebar-layout';
import AppHeaderLayout from './app/app-header-layout';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface AppLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
    const page: any = usePage();
    const user = page.props?.auth?.user;
    const role = user?.role; // "seller" / "admin" / "customer"

    return (
        <div className="min-h-screen flex flex-col bg-background">

            {/* Top Navbar */}
            {role !== 'seller' && role !== 'admin' && (
                <AppHeaderLayout />
            )}

            <div className="flex flex-1">

                {/* Sidebar */}
                {role !== 'seller' && role !== 'admin' && (
                    <AppSidebarLayout />
                )}

                <main className="flex-1 p-4 md:p-6">

                    {/* Breadcrumbs */}
                    {breadcrumbs && (
                        <nav className="mb-4 text-sm text-gray-600">
                            {breadcrumbs.map((item, index) => (
                                <span key={index}>
                                    <Link 
                                        href={item.href} 
                                        className="hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                    {index < breadcrumbs.length - 1 && " / "}
                                </span>
                            ))}
                        </nav>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
