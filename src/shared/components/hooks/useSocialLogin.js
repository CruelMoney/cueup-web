import { useState } from 'react';
import { useServerContext } from './useServerContext';

const useSocialLogin = (options) => {
    const { redirect } = options || {};
    const { environment } = useServerContext();
    const [socialLoading, setSocialLoading] = useState(null);

    const onPressSocial = (social) => (e) => {
        e.preventDefault();
        setSocialLoading(social);
        const params = '?redirect=' + (redirect || window.location.href);
        window.location.replace(environment.GQL_DOMAIN + '/auth/' + social + params);
    };

    return [onPressSocial, { socialLoading }];
};

export default useSocialLogin;
