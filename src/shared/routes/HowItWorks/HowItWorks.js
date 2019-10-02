import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import addTranslate from '../../components/higher-order/addTranslate';
import ScrollToTop from '../../components/common/ScrollToTop';
import content from './content.json';
import HowItWorks from './components/HowItWorks';

class Index extends Component {
    render() {
        const { translate } = this.props;
        const title = translate('how-it-works') + ' | Cueup';
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
                <ScrollToTop />
                <HowItWorks translate={translate} />
            </div>
        );
    }
}

export default addTranslate(Index, content);
