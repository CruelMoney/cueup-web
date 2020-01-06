import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));
const Stripe = loadable(() => import('./stripe'));

const useExternals = () => {
    useEffect(() => {
        setTimeout(() => {
            Olark.preload();
            Stripe.preload();
        }, 4000);
    }, []);
};

export default useExternals;
