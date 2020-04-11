import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));
const Stripe = loadable(() => import('./stripe'));

const excludedRoutes = ['gig', 'dj-name-generator'];

const useExternals = () => {
    useEffect(() => {
        Stripe.preload();
        setTimeout(() => {
            if (!excludedRoutes.some(window.location.pathname.includes)) {
                Olark.preload();
            }
        }, 4000);
    }, []);
};

export default useExternals;
