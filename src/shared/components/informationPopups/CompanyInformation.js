import React from 'react';
import { gql, useMutation } from '@apollo/client';
import styled from 'styled-components';
import createPersistedState from 'use-persisted-state';
import Popup from 'components/common/Popup';
import { Body, H2 } from 'components/Text';
import { Avatar, Col, PrimaryButton, RowMobileCol, SmartButton } from 'components/Blocks';
const useCompanyInfoPopup = createPersistedState('company-info-popup');

const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;

const Wrapper = styled.div`
    padding: 1em;
    @media only screen and (max-width: 480px) {
        padding-bottom: 75px;
    }
`;

const CompanyInformationPopup = ({ userId }) => {
    const [showing, setShowing] = useCompanyInfoPopup(true);

    const [mutate, { loading }] = useMutation(DELETE_USER, {
        variables: {
            userId,
        },
    });

    const doDelete = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your profile? This cannot be undone and you will loose all data.'
        );
        if (!confirmed) {
            return;
        }
        mutate();
    };

    return (
        <Popup showing={showing} hideClose width={600}>
            <Wrapper>
                <RowMobileCol reverse middle>
                    <H2
                        small
                        style={{ marginTop: '20px', marginBottom: '1em', fontWeight: 700, flex: 1 }}
                    >
                        We get a lot of events, but can't guarantee jobs for every member
                    </H2>
                    <Avatar
                        size="extraLarge"
                        src="https://d1i5zrp3ng76nh.cloudfront.net/social_images/christopher_2.jpg"
                        style={{}}
                    />
                </RowMobileCol>

                <Body>
                    Hi, I’m Christopher, and I’m the founder and only employee at Cueup. I’m doing
                    everything in my power to get you gigs, but I can’t guarantee jobs for every
                    member.
                </Body>
                <br />
                <Body>
                    <b>Cueup is not like a booking agency</b>. Cueup is a free-to-use platform that
                    connects you to event organizers, facilitates payments, and handles cancelation
                    policies - <b>your job is to contact the organizer and sell your service</b> -
                    we just make it much easier.
                </Body>
                <br />
                <Body>
                    If you have questions, critique, or suggestions, please message me at
                    chris@cueup.io or use the support chat.
                </Body>
                <Col>
                    <PrimaryButton
                        onClick={() => setShowing(false)}
                        style={{ maxWidth: '100%', marginTop: '42px' }}
                    >
                        I understand, let's do this!
                    </PrimaryButton>
                    <SmartButton
                        level="secondary"
                        warning
                        loading={loading}
                        onClick={doDelete}
                        style={{ maxWidth: '100%', marginTop: '12px' }}
                    >
                        That sucks, delete my profile
                    </SmartButton>
                </Col>
            </Wrapper>
        </Popup>
    );
};

export default CompanyInformationPopup;
