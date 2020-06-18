import React, { Component } from 'react';
import { PageTitle } from 'components/Text';
import { CollapsibleContainer, Collapsible } from '../../../../../components/common/Collapsible';

export default class DJ extends Component {
    themeColor = '#31DAFF';

    render() {
        const { translate } = this.props;

        return (
            <div>
                <PageTitle>
                    {translate('faq:Questions and answers')} <span>{translate('faq:For DJs')}</span>
                </PageTitle>

                <CollapsibleContainer changeHash lazyLoad={false}>
                    <Collapsible label={translate('faq:dj.1.q')}>
                        <p>{translate('faq:dj.1.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.2.q')}>
                        <p>{translate('faq:dj.2.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.3.q')}>
                        <p>{translate('faq:dj.3.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.4.q')}>
                        <p>{translate('faq:dj.4.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.5.q')}>
                        <p>{translate('faq:dj.5.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.6.q')}>
                        <p>{translate('faq:dj.6.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.7.q')}>
                        <p>{translate('faq:dj.7.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.8.q')}>
                        <p>{translate('faq:dj.8.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.9.q')}>
                        <p>{translate('faq:dj.9.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.10.q')}>
                        <p>{translate('faq:dj.10.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.11.q')}>
                        <p>{translate('faq:dj.11.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.12.q')}>
                        <p>{translate('faq:dj.12.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.13.q')}>
                        <p>{translate('faq:dj.13.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:dj.14.q')}>
                        <p>{translate('faq:dj.14.a')}</p>
                    </Collapsible>
                </CollapsibleContainer>
            </div>
        );
    }
}
