import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));
const Stripe = loadable(() => import('./stripe'));

const excludedOlarkRoutes = ['gig', 'dj-name-generator'];
const excludedStripeRoutes = ['dj-name-generator'];

const useExternals = () => {
    useEffect(() => {
        if (!excludedStripeRoutes.some((s) => window.location.pathname.includes(s))) {
            Stripe.preload();
        }
        setTimeout(() => {
            if (!excludedOlarkRoutes.some((s) => window.location.pathname.includes(s))) {
                Olark.preload();
            }
        }, 4000);
    }, []);
};

export default useExternals;
