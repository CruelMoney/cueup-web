import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import ScrollToTop from '../../components/common/ScrollToTop';
import About from './components/About';

class Index extends Component {
    render() {
        const { translate } = this.props;
        const title = translate('about') + ' | Cueup';

        return (
            <div>
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />
                </Helmet>
                <ScrollToTop />

                <About />
            </div>
        );
    }
}

export default Index;
