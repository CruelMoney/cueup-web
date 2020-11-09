import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { NavLink, useRouteMatch } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import Tooltip from 'components/Tooltip';
import { Col, InfoBox, InfoPill, Row, RowWrap } from '../../../../components/Blocks';
import Map from '../../../../components/common/Map';

import { Body, BodyBold, BodySmall, HeaderTitle, TitleClean } from '../../../../components/Text';
import { Label, ProFeature } from '../../../../components/FormComponents';
import ContactPills from '../../components/blocks/ContactPills';

const Information = React.forwardRef(({ gig, loading }, ref) => {
    const { event, statusHumanized, referred } = gig || {};
    const { name, location, start } = event || {};

    const coordinates = {
        lat: location?.latitude,
        lng: location?.longitude,
    };

    return (
        <Col ref={ref}>
            <Col style={{ flex: 1, alignItems: 'flex-start', marginBottom: 30 }}>
                <Row>
                    <HeaderTitle dark>{name || <Skeleton width={100} />}</HeaderTitle>
                </Row>
                <BodyBold data-cy="gig-status" style={{ margin: 0, color: '#00d1ff' }}>
                    {statusHumanized || <Skeleton width={200} />}
                </BodyBold>
                <BodyBold opacity={0.75} style={{ margin: 0 }}>
                    {location?.name || <Skeleton width={100} />}
                    {'  ·  '}
                    {start?.formattedDate || <Skeleton width={150} />}
                </BodyBold>

                {location && (
                    <div
                        style={{
                            height: '150px',
                            width: '100%',
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginTop: 12,
                            pointerEvents: 'none',
                        }}
                    >
                        <div style={{ top: -24, position: 'relative' }}>
                            <Map
                                defaultCenter={coordinates}
                                height={150 + 24 * 2}
                                hideRoads
                                zoomScaler={150}
                                radius={5000}
                                value={coordinates}
                                editable={false}
                            />
                        </div>
                    </div>
                )}
            </Col>
            {loading ? <Skeleton count={3} /> : <MainInformation gig={gig} />}
        </Col>
    );
});

const MainInformation = ({ gig }) => {
    const match = useRouteMatch();

    const { event, showInfo } = gig || {};
    const {
        description,
        rider,
        genres,
        end,
        start,
        guestsCount,
        budget,
        contactPhone,
        contactEmail,
        address,
        eventType,
        contactName,
    } = event || {};

    const startMoment = moment(start?.localDate);
    const endMoment = moment(end?.localDate);
    const hours = endMoment.diff(startMoment, 'hours');
    const date = startMoment.toDate().toLocaleDateString();

    return (
        <>
            {address && showInfo && (
                <CustomLabel>
                    <TitleClean>Address</TitleClean>
                    <BodySmall>{address}</BodySmall>
                </CustomLabel>
            )}
            <CustomLabel>
                <TitleClean>Connect with {contactName}</TitleClean>
                {!showInfo && (
                    <BodySmall>
                        Information will be available when the gig is confirmed - you can use the
                        chat until then.
                        <br />
                        <NavLink to={match.url + '/contact-get-pro'}>
                            <b style={{ color: '#4d6480' }}>Pro members</b>
                        </NavLink>{' '}
                        can see the contact information any time.
                    </BodySmall>
                )}
                <RowWrap>
                    <ContactPills email={contactEmail} phone={contactPhone} showInfo={showInfo} />
                </RowWrap>
            </CustomLabel>
            <CustomLabel>
                <TitleClean>Description</TitleClean>
                <BodySmall>{description}</BodySmall>
                <RowWrap style={{ marginRight: '-24px', marginBottom: -15 }}>
                    {eventType?.map((s) => (
                        <InfoBox key={s}>
                            <span>Type</span>
                            {s}
                        </InfoBox>
                    ))}
                    <InfoBox minHeight>
                        <span>People</span>
                        {guestsCount}
                    </InfoBox>

                    {rider?.speakers && (
                        <InfoBox minHeight>
                            <span>Requested</span>Speakers
                        </InfoBox>
                    )}
                    {rider?.lights && (
                        <InfoBox minHeight>
                            <span>Requested</span>Lights
                        </InfoBox>
                    )}
                    {rider?.microphone && (
                        <InfoBox minHeight>
                            <span>Requested</span>Microphone
                        </InfoBox>
                    )}
                    {rider?.smokeMachine && (
                        <InfoBox minHeight>
                            <span>Requested</span>Smoke Machine
                        </InfoBox>
                    )}
                </RowWrap>
            </CustomLabel>
            <CustomLabel>
                <TitleClean>Budget</TitleClean>
                <BodySmall>{budget ? `Up to ${budget?.formatted}` : 'Not specified'}</BodySmall>
            </CustomLabel>
            <CustomLabel>
                <TitleClean>Music</TitleClean>
                <RowWrap style={{ marginRight: '-24px' }}>
                    {genres?.map((g) => (
                        <InfoBox key={g}>{g}</InfoBox>
                    ))}
                </RowWrap>
            </CustomLabel>
            <CustomLabel>
                <TitleClean>Date and time</TitleClean>

                <BodySmall>{rider?.formatted}</BodySmall>
                <RowWrap style={{ marginRight: '-24px' }}>
                    <InfoBox minHeight>
                        <span>Date</span>
                        {date}
                    </InfoBox>
                    <InfoBox minHeight>
                        <span>Start</span>
                        {start?.formattedTime}
                    </InfoBox>
                    <InfoBox minHeight>
                        <span>End</span>
                        {end?.formattedTime}
                    </InfoBox>
                    <InfoBox minHeight>
                        <span>Hours</span>
                        {hours}
                    </InfoBox>
                </RowWrap>
            </CustomLabel>
        </>
    );
};

const CustomLabel = styled(Label)`
    margin-bottom: 30px;
    h3 {
        margin-bottom: 0.5em;
    }
    > div {
        margin-top: 15px;
    }
`;

export default Information;
