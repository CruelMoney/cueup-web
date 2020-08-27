import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { gigStates } from 'constants/constants';
import {
    Col,
    InfoBox,
    RowWrap,
    SecondaryButton,
    PrimaryButton,
} from '../../../../components/Blocks';

import { Body, BodySmall, TitleClean } from '../../../../components/Text';
import { Label, ProFeature } from '../../../../components/FormComponents';
import ContactPills from '../../components/blocks/ContactPills';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';

const MobileActionsButtons = styled.div`
    display: none;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background: #fff;
    border-top: 1px solid rgb(233, 236, 240, 0.5);
    padding-bottom: env(safe-area-inset-bottom);
    > div {
        display: flex;
        padding: 15px;
    }
    button {
        flex: 1;
    }
    @supports (backdrop-filter: none) {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: saturate(180%) blur(20px);
    }
    @media only screen and (max-width: 425px) {
        display: block;
    }
`;

const MobileActionButtons = ({ showDecline, navigateToOffer }) => {
    const [show, setShow] = useState(false);
    const portal = useRef();

    useEffect(() => {
        portal.current = document.querySelector('#portal');
        setShow(true);
    }, []);

    if (!show || !portal.current) {
        return null;
    }

    return createPortal(
        <MobileActionsButtons>
            <RowWrap>
                <SecondaryButton onClick={showDecline}>Decline</SecondaryButton>
                <PrimaryButton onClick={navigateToOffer}>Make offer</PrimaryButton>
            </RowWrap>
        </MobileActionsButtons>,
        portal.current
    );
};

const Content = React.forwardRef(
    ({ gig, showDecline, translate, history, navigateToOffer }, ref) => {
        const match = useRouteMatch();

        if (!gig) {
            return null;
        }

        const { event, showInfo } = gig;

        let {
            description,
            rider,
            genres,
            end,
            start,
            guestsCount,
            contactName,
            contactPhone,
            contactEmail,
            address,
        } = event;

        const startMoment = moment(start.localDate);
        const endMoment = moment(end.localDate);
        const hours = endMoment.diff(startMoment, 'hours');
        contactName = contactName.split(' ')[0];
        const date = startMoment.format('YYYY-MM-DD');

        const enableButtons = [gigStates.REQUESTED, gigStates.ACCEPTED].includes(gig.status);

        return (
            <Col ref={ref}>
                <Body style={{ marginBottom: '30px' }}>
                    See what {contactName} has requested and adjust your offer accordingly. Don’t
                    hesitate to ask the organizer for more details.
                </Body>
                {address && showInfo && (
                    <CustomLabel>
                        <TitleClean>Address</TitleClean>
                        <BodySmall>{address}</BodySmall>
                    </CustomLabel>
                )}
                <CustomLabel>
                    <TitleClean>Get in touch with {contactName}</TitleClean>

                    {!showInfo && (
                        <BodySmall>
                            Information will be available when the gig is confirmed - you can use
                            the chat until then.
                            <br />
                            <NavLink to={match.url + '/contact-get-pro'}>
                                <b style={{ color: '#4d6480' }}>Pro members</b>
                            </NavLink>{' '}
                            can see the contact information any time.
                        </BodySmall>
                    )}
                    <RowWrap>
                        <ContactPills
                            email={contactEmail}
                            phone={contactPhone}
                            showInfo={showInfo}
                        />
                    </RowWrap>
                </CustomLabel>
                <CustomLabel>
                    <TitleClean>Description</TitleClean>
                    <BodySmall>{description}</BodySmall>
                </CustomLabel>
                <CustomLabel>
                    <TitleClean>Music</TitleClean>
                    <RowWrap style={{ marginRight: '-24px' }}>
                        {genres.map((g) => (
                            <InfoBox key={g}>{g}</InfoBox>
                        ))}
                    </RowWrap>
                </CustomLabel>
                <CustomLabel>
                    <TitleClean>Requirements</TitleClean>

                    <BodySmall>{rider.formatted}</BodySmall>
                    <RowWrap style={{ marginRight: '-24px' }}>
                        <InfoBox minHeight>
                            <span>Date</span>
                            {date}
                        </InfoBox>
                        <InfoBox minHeight>
                            <span>Start</span>
                            {start.formattedTime}
                        </InfoBox>
                        <InfoBox minHeight>
                            <span>End</span>
                            {end.formattedTime}
                        </InfoBox>
                        <InfoBox minHeight>
                            <span>Hours</span>
                            {hours}
                        </InfoBox>

                        <InfoBox minHeight>
                            <span>People</span>
                            {guestsCount}
                        </InfoBox>

                        {rider.speakers && <InfoBox minHeight>Speakers</InfoBox>}
                        {rider.lights && <InfoBox minHeight>Lights</InfoBox>}
                    </RowWrap>
                </CustomLabel>
                {enableButtons && (
                    <MobileActionButtons
                        showDecline={showDecline}
                        navigateToOffer={navigateToOffer}
                    />
                )}
            </Col>
        );
    }
);

const CustomLabel = styled(Label)`
    margin-bottom: 30px;
    h3 {
        margin-bottom: 0.5em;
    }
    > div {
        margin-top: 15px;
    }
`;

const Information = ({ loading, ...props }) =>
    loading ? <LoadingPlaceholder2 /> : <Content {...props} />;

export default Information;
