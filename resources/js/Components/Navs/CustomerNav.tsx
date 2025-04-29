import {Link, usePage} from "@inertiajs/react";
import React, {useState} from "react";

interface NavItem {
    title: string;
    href?: string;
    description?: string;
    items?: {
        title: string;
        href: string;
        description: string;
    }[];
}

const navigation: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/customer/dashboard',
    },
    // {
    //     title: 'Logs',
    //     items: [
    //         { title: 'Audit Logs', href: '/logs/audit', description: 'Show system audit logs' },
    //     ]
    // }
];

const CustomerNav = () => {
    const user: any = usePage().props.auth;

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    const NavItemContent = ({ item }: { item: NavItem }) => (
        <span className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            {item.title}
        </span>
    );

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left section with logo and nav items */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            {/*<Link href="/" className="text-xl font-bold">*/}
                            {/*    <img src="/images/soill_logo.png" alt="SOILL Logo" className="h-16 w-16 pr-3 object-contain"/>*/}
                            {/*</Link>*/}
                        </div>

                        {/* Navigation Items */}
                        <div className="hidden sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <div
                                    key={item.title}
                                    className="relative group"
                                >
                                    <div
                                        className="inline-flex flex-col"
                                        onMouseEnter={() => setOpenMenu(item.title)}
                                        onMouseLeave={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const isMovingTowardsDropdown = e.clientY > rect.bottom;

                                            if (!isMovingTowardsDropdown) {
                                                setOpenMenu(null);
                                            }
                                        }}
                                    >
                                        {item.href ? (
                                            <Link href={item.href}>
                                                <NavItemContent item={item} />
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                className="inline-flex items-center border-b-2 border-transparent"
                                            >
                                                <NavItemContent item={item} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropwdown Menu */}
                                    {item.items && openMenu === item.title && (
                                        <div
                                            className="absolute top-full left-0 mt-1 w-screen max-w-3xl transform px-2 sm:px-0 z-50"
                                            onMouseEnter={() => setOpenMenu(item.title)}
                                            onMouseLeave={() => setOpenMenu(null)}
                                        >
                                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                                <div className="relative bg-white px-5 py-6 sm:p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {item.items.map((subItem) => (
                                                            <Link
                                                                key={subItem.title}
                                                                href={subItem.href}
                                                                className="-m-3 p-3 flex items-start rounded-lg hover:bg-green-100"
                                                            >
                                                                <div className="ml-4">
                                                                    <p className="text-base font-medium text-green-600">
                                                                        {subItem.title}
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {subItem.description}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right section for user */}
                    <div className="flex items-center">
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <span className="text-gray-700 px-3">Welcome, {user.user.name || 'Guest'}</span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-gray-500 hover:text-gray-700 px-3 py-2"
                            >
                                Logout
                            </Link>
                        </div>

                        {/* Mobile Menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={openMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.title}>
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                    >
                                        {item.title}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                        onClick={() => setActiveSubmenu(activeSubmenu === item.title ? null : item.title)}
                                    >
                                        {item.title}
                                    </button>
                                )}

                                {item.items && activeSubmenu === item.title && (
                                    <div className="pl-4">
                                        {item.items.map((subItem) => (
                                            <Link
                                                key={subItem.title}
                                                href={subItem.href}
                                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-100 hover:border-green-300"
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Mobile user menu */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="px-4 py-2">
                                <span className="text-gray-700">Welcome, {user.user.name || 'Guest'}</span>
                            </div>
                            <Link
                                href="/logout"
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default CustomerNav;
