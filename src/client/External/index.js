import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));
const Stripe = loadable(() => import('./stripe'));

const useExternals = () => {
    useEffect(() => {
        Stripe.preload();
        setTimeout(() => {
            if (!window.location.pathname.includes('gig')) {
                Olark.preload();
            }
        }, 4000);
    }, []);
};

export default useExternals;
