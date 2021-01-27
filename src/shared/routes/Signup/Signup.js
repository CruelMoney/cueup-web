import React from 'react';
import { Helmet } from 'react-helmet-async';

import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { useServerContext } from 'components/hooks/useServerContext';
import Menu from 'components/Navigation';

import ScrollToTop from '../../components/common/ScrollToTop';
import Signup from './components/Signup';
import content from './content.json';

const Index = () => {
    const { translate } = useNamespaceContent(content, 'signup');
    const title = translate('apply-to-become-dj') + ' | Cueup';

    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />

                <meta
                    name="apple-itunes-app"
                    content="app-id=1458267647, app-argument=userProfile"
                />
            </Helmet>
            <Menu />

            <ScrollToTop />
            <Signup translate={translate} />
        </div>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default Index;
