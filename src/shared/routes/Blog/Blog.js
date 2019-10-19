import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet-async';

import Footer from '../../components/common/Footer';
import addTranslate from '../../components/higher-order/addTranslate';
import ScrollToTop from '../../components/common/ScrollToTop';
import Blog from './components/Blog';
import Post from './components/Post';
import content from './content.json';
import './index.css';

class Index extends Component {
    themeColor = '#25F4D2';
    secondColor = '#31DAFF';

    render() {
        const { match, translate } = this.props;
        const title = 'Blog | Cueup';
        return (
            <div className="blog">
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />
                    <meta property="og:site_name" content="Cueup Blog" />
                </Helmet>
                <Switch>
                    <Route exact path={match.path} component={Blog} />
                    <Route path={`${match.path}/:postTitle`} component={Post} />
                </Switch>
                <Footer
                    color={this.themeColor}
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./signup')}
                    firstLabel={translate('arrange-event')}
                    secondLabel={translate('apply-to-become-dj')}
                    title={translate('ready-to-get-started')}
                    subTitle={translate('arrange-event-or-become-dj')}
                />
                <ScrollToTop />
            </div>
        );
    }
}

export default addTranslate(Index, content);
