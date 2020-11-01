import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Events from './components/Events';

export default class Index extends Component {
    render() {
        const { user = {} } = this.props;

        const { userMetadata = {} } = user;
        const djName = userMetadata.firstName;
        const title = djName + ' | Events';

        return (
            <div>
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />
                </Helmet>
                <Events {...this.props} />
            </div>
        );
    }
}
