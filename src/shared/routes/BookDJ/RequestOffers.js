import React, { useState } from 'react';

import { InlineIcon } from '@iconify/react';
import speechIcon from '@iconify/icons-ion/ios-text';

import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { RowWrap, SmartButton } from 'components/Blocks';
import { BodyBold, BodySmall } from 'components/Text';

import Step4 from 'components/common/RequestForm/Step4';
import { useForm } from 'components/hooks/useForm';
import { ME } from 'components/gql';
import useUrlState from 'components/hooks/useUrlState';
import { GreyBox } from './Components';

export const RequestOffers = ({
    form,
    setValue,
    registerValidation,
    unregisterValidation,
    runValidations,
}) => {
    const { data: userData } = useQuery(ME);
    const [error, setError] = useState();

    const handleChange = (data) => {
        setError(null);
        setValue(data);
    };

    const handleSubmit = () => {
        runValidations();
    };

    return (
        <GreyBox>
            {form.showContactInfo ? (
                <Step4
                    hideHeadline
                    form={form}
                    handleChange={handleChange}
                    runValidations={runValidations}
                    registerValidation={registerValidation}
                    unregisterValidation={unregisterValidation}
                    next={handleSubmit}
                    back={() => setValue({ showContactInfo: false })}
                    // loading={loading}
                    user={userData?.me}
                    style={{
                        width: 'auto',
                    }}
                    buttonLabel="Get quotes"
                />
            ) : (
                <>
                    <BodyBold>
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
                        Get tailored prices directly from the DJs. We’ll find the most suitable DJs
                        and inquire them to send their best offers for your event.
                    </BodySmall>
                    <SmartButton
                        onClick={() => setValue({ showContactInfo: true })}
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
                    </SmartButton>
                </>
            )}
        </GreyBox>
    );
};
