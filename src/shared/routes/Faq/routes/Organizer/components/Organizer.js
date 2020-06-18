import React, { Component } from 'react';
import { PageTitle } from 'components/Text';
import { CollapsibleContainer, Collapsible } from '../../../../../components/common/Collapsible';

export default class Organizer extends Component {
    themeColor = '#31DAFF';

    render() {
        const { translate } = this.props;

        return (
            <div>
                <PageTitle>
                    {translate('faq:Questions and answers')}
                    <span>{translate('faq:For organizers')}</span>
                </PageTitle>

                <CollapsibleContainer changeHash lazyLoad={false}>
                    <Collapsible label={translate('faq:organizer.1.q')}>
                        <p>{translate('faq:organizer.1.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.2.q')}>
                        <p>{translate('faq:organizer.2.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.3.q')}>
                        <p>{translate('faq:organizer.3.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.4.q')}>
                        <p>{translate('faq:organizer.4.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.5.q')}>
                        <p>{translate('faq:organizer.5.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.6.q')}>
                        <p>{translate('faq:organizer.6.a')}</p>
                    </Collapsible>

                    <Collapsible label={translate('faq:organizer.8.q')}>
                        <p>{translate('faq:organizer.8.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.9.q')}>
                        <p>{translate('faq:organizer.9.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.10.q')}>
                        <p>{translate('faq:organizer.10.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.11.q')}>
                        <p>{translate('faq:organizer.11.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.12.q')}>
                        <p>{translate('faq:organizer.12.a')}</p>
                    </Collapsible>
                    <Collapsible label={translate('faq:organizer.13.q')}>
                        <p>{translate('faq:organizer.13.a')}</p>
                    </Collapsible>
                </CollapsibleContainer>
            </div>
        );
    }
}
