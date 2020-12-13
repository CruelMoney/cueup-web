// get google analytics cookie

import { useCookies } from 'react-cookie';
import CRC32 from 'crc-32';
import { useEffect, useMemo } from 'react';
import { gtag } from '../../utils/analytics/gtagPlugin';

export const useGoogleOptimize = (experimentId, variants = []) => {
    const [cookies] = useCookies();
    const googleUserId = cookies._ga;

    if (variants.length < 2) {
        console.warn(
            `WARN: There are should be at least TWO experiment variants and you have: ${variants.length}.`
        );
    }

    // get a variation id based on the users cookie
    const variationId = useMemo(() => {
        return Math.abs(CRC32.str(`${googleUserId}${experimentId}`) % variants.length);
    }, [googleUserId, experimentId, variants.length]);

    // register the variation for this experiemnt
    useEffect(() => {
        console.log('SETTING WINDOW GTAG', gtag);
        gtag('set', { exp: `${experimentId}.${variationId}` });
    }, [experimentId, variationId]);

    return variants[variationId];
};
