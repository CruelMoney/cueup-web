import React from 'react';
import { Body } from 'components/Text';
import { PrimaryButton } from 'components/Blocks';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { RequestSection } from './RequestForm';

const Step5 = ({ translate, pushShouldBeEnabled, userId }) => {
    const { showPrompt } = usePushNotifications({ userId });

    return (
        <div>
            <h3>{translate('request-form.step-5.header')}</h3>
            <RequestSection>
                <Body center>{translate('post-event-succes-message')}</Body>
            </RequestSection>
            {pushShouldBeEnabled && (
                <>
                    <Body style={{ marginBottom: 9 }} center>
                        {translate('post-event-succes-message-2')}
                    </Body>
                    <PrimaryButton style={{ margin: 'auto' }} onClick={showPrompt}>
                        Get notifications
                    </PrimaryButton>
                </>
            )}
        </div>
    );
};

export default Step5;
