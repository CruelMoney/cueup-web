import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Environment } from 'constants/constants';
import Navlink from './common/Navlink';

class BreadCrumbs extends Component {
    render() {
        const { location } = this.props;
        const crumbs = location.pathname.split('/');
        const isLocale = crumbs[1] === 'dk';
        const renderCrumbs = crumbs.slice(isLocale ? 3 : 2, crumbs.length);
        const endIdx = isLocale ? 4 : 3;

        if (!renderCrumbs.length) {
            return null;
        }

        return (
            <ol className="breadcrumbs" itemScope itemType="http://schema.org/BreadcrumbList">
                {renderCrumbs.map((crumb, idx) => {
                    return (
                        <li
                            key={`breadcrumb-${idx + 1}`}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <Navlink
                                itemID={`${Environment.CALLBACK_DOMAIN}${crumbs
                                    .slice(0, idx + endIdx)
                                    .join('/')}`}
                                itemScope
                                itemType="http://schema.org/Thing"
                                itemProp="item"
                                to={`${crumbs.slice(0, idx + endIdx).join('/')}`}
                            >
                                <span itemProp="name">{crumb.replace('-', ' ')}</span>
                            </Navlink>
                            <meta itemProp="position" content={idx + 1} />
                        </li>
                    );
                })}
            </ol>
        );
    }
}

export default withRouter(BreadCrumbs);
