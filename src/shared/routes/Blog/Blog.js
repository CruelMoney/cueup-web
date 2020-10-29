import React from 'react';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet-async';
import useNamespaceContent from 'components/hooks/useNamespaceContent';

import { appRoutes } from 'constants/locales/appRoutes';
import Menu from 'components/Navigation';
import Footer from '../../components/common/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import Blog from './components/Blog';
import Post from './components/Post';
import './index.css';
import content from './content.json';

const Index = () => {
    const { translate } = useNamespaceContent(content, 'blog');
    const title = 'Blog | Cueup';

    return (
        <div className="blog">
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />
                <meta property="og:site_name" content="Cueup Blog" />
            </Helmet>
            <Menu dark relative />
            <Switch>
                <Route exact path={translate(appRoutes.blog)} component={Blog} />
                <Route path={`${translate(appRoutes.blog)}/:postTitle`} component={Post} />
            </Switch>
            <Footer
                firstTo={translate(appRoutes.home)}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('arrange-event')}
                secondLabel={translate('apply-to-become-dj')}
                title={translate('ready-to-get-started')}
                subTitle={translate('arrange-event-or-become-dj')}
            />
            <ScrollToTop />
        </div>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default Index;
