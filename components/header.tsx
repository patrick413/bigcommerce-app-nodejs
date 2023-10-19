import { Box, Tabs } from '@bigcommerce/big-design';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InnerHeader from './innerHeader';
export const TabIds = {
    CONFIG: 'config',
    // COLLECTION: 'collection',
    STYLE: 'styles',
    ADVANCE: 'advance',
    // PRODUCTS:'products'
};

export const TabRoutes = {
    [TabIds.CONFIG]: '/',
    // [TabIds.COLLECTION]: '/collection',
    [TabIds.STYLE]: '/styles',
    [TabIds.ADVANCE]: '/advance',
    // [TabIds.PRODUCTS]: '/products',
};

const HeaderlessRoutes = [
    '/orders/[orderId]',
    '/orders/[orderId]/labels',
    '/orders/[orderId]/modal',
    '/productAppExtension/[productId]',
];

const InnerRoutes = [
    '/products/[pid]',
    '/collection/[cid]',
];

const HeaderTypes = {
    GLOBAL: 'global',
    INNER: 'inner',
    HEADERLESS: 'headerless',
};

const Header = () => {
    const [activeTab, setActiveTab] = useState<string>('');
    const [headerType, setHeaderType] = useState<string>(HeaderTypes.GLOBAL);
    const router = useRouter();
    const { pathname } = router;
    
    useEffect(() => {
        if (InnerRoutes.includes(pathname)) {
            // Use InnerHeader if route matches inner routes
            setHeaderType(HeaderTypes.INNER);
        } else if (HeaderlessRoutes.includes(pathname)) {
            setHeaderType(HeaderTypes.HEADERLESS);
        } else {
            // Check if new route matches TabRoutes
            const tabKey = Object.keys(TabRoutes).find(key => TabRoutes[key] === pathname);

            // Set the active tab to tabKey or set no active tab if route doesn't match (404)
            setActiveTab(tabKey ?? '');
            setHeaderType(HeaderTypes.GLOBAL);
        }
    }, [pathname]);

    useEffect(() => {
        // Prefetch products page to reduce latency (doesn't prefetch in dev)
        router.prefetch('/collection');
    });

    const items = [
        { ariaControls: 'home', id: TabIds.CONFIG, title: 'Configuration' },
        // { ariaControls: 'collection', id: TabIds.COLLECTION, title: 'Collections'},
        { ariaControls: 'styles', id: TabIds.STYLE, title: 'Style Customization' },
        { ariaControls: 'advance', id: TabIds.ADVANCE, title: 'Advance Options' },
        // { ariaControls: 'products', id: TabIds.PRODUCTS, title: 'products' },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);

        return router.push(TabRoutes[tabId]);
    };

    if (headerType === HeaderTypes.HEADERLESS) return null;
    if (headerType === HeaderTypes.INNER) return <InnerHeader />;

    return (
        <Box marginBottom="xxLarge">
            <Tabs
                activeTab={activeTab}
                items={items}
                onTabClick={handleTabClick}
            />
        </Box>
    );
};

export default Header;
