import React from 'react';

import { InlineIcon } from '@iconify/react';
import speechIcon from '@iconify/icons-ion/ios-text';

import { useQuery } from '@apollo/client';
import { RowWrap, SmartButton } from 'components/Blocks';
import { BodyBold, BodySmall } from 'components/Text';

import Step4 from 'components/common/RequestForm/Step4';
import { useForm } from 'components/hooks/useForm';
import { ME } from 'components/gql';
import { GreyBox } from './Components';

export const RequestOffers = ({ form, goBack }) => {
    const { data: userData } = useQuery(ME);

    const {
        registerValidation,
        unregisterValidation,
        runValidations,
        form: contactForm,
        setValue,
    } = useForm();

    return (
        <GreyBox>
            {/* <BodyBold>
                <InlineIcon
                    icon={speechIcon}
                    color="#25F4D2"
                    width={'1.5em'}
                    height={'1.5em'}
                    style={{ marginRight: 9, marginBottom: -6 }}
                />
                Tired of searching?
            </BodyBold>
            <BodySmall style={{ marginBottom: 15 }}>
                Get tailored prices directly from the DJs. We’ll find the most suitable DJs and
                inquire them to send their best offers for your event.
            </BodySmall>
            <SmartButton
                level="secondary"
                fullWidth
                style={{
                    height: '50px',
                    backgroundColor: '#fff',
                    borderRadius: 13,
                    border: '0.5px solid rgba(77, 100, 128, 0.2)',
                }}
            >
                Get quotes - let us find the DJs
            </SmartButton> */}
            <Step4
                hideHeadline
                form={contactForm}
                handleChange={setValue}
                runValidations={runValidations}
                registerValidation={registerValidation}
                unregisterValidation={unregisterValidation}
                next={console.log}
                back={goBack}
                // loading={loading}
                user={userData?.me}
                style={{
                    width: 'auto',
                }}
            />
        </GreyBox>
    );
};
