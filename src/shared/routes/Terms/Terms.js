import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet-async';
import ScrollToTop from '../../components/common/ScrollToTop';
import Terms from './components/Terms';
import Agreements from './routes/Agreements';
import Privacy from './routes/Privacy';

class Index extends Component {
    render() {
        const { translate } = this.props;

        const title = translate('Terms & Privacy') + ' | Cueup';

        return (
            <Terms {...this.props}>
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />
                </Helmet>
                <ScrollToTop />
                <Switch>
                    <Route path={translate('routes./terms/agreements')} component={Agreements} />
                    <Route path={translate('routes./terms/privacy')} component={Privacy} />
                </Switch>
            </Terms>
        );
    }
}

export default Index;
