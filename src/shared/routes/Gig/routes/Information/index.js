import React from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { NavLink, useRouteMatch } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { UsingBookingLinkPill } from 'routes/Gigs/components/Shared';
import { Col, InfoBox, Row, RowWrap } from '../../../../components/Blocks';
import Map from '../../../../components/common/Map';

import { BodyBold, BodySmall, HeaderTitle, TitleClean } from '../../../../components/Text';
import ContactPills from '../../components/blocks/ContactPills';

const Information = React.forwardRef(
    ({ gig, opportunity, opportunityLocked, theEvent, loading, openChat }, ref) => {
        let { statusHumanized } = gig || {};
        if (opportunity) {
            statusHumanized = 'Still looking for a DJ, send your offer';
        }
        const { name, location, start, organizer, createdAt } = theEvent || {};

        const coordinates = {
            lat: location?.latitude,
            lng: location?.longitude,
        };

        let createdTimeAgo = loading ? null : moment(createdAt?.UTC).fromNow();
        createdTimeAgo = 'Added ' + createdTimeAgo;

        return (
            <Col ref={ref}>
                <Col style={{ flex: 1, alignItems: 'flex-start', marginBottom: 30 }}>
                    <Row>
                        <HeaderTitle dark>{name || <Skeleton width={100} />}</HeaderTitle>
                    </Row>
                    <TopInfoRow middle>
                        <Col>
                            <RowWrap>{gig?.referred && <UsingBookingLinkPill />}</RowWrap>
                            <BodyBold opacity={0.75} style={{ margin: 0, marginTop: 12 }}>
                                {loading ? (
                                    <Skeleton width={100} />
                                ) : organizer?.userMetadata.firstName ? (
                                    organizer?.userMetadata.firstName + '  ·  '
                                ) : null}

                                {loading ? <Skeleton width={100} /> : createdTimeAgo}
                            </BodyBold>

                            <BodyBold opacity={0.75} style={{ margin: 0 }}>
                                {location?.name || <Skeleton width={100} />}
                                {'  ·  '}
                                {start?.formattedDate || <Skeleton width={150} />}
                            </BodyBold>
                            <BodyBold data-cy="gig-status" style={{ margin: 0, color: '#00d1ff' }}>
                                {loading || !statusHumanized ? (
                                    <Skeleton width={200} />
                                ) : (
                                    statusHumanized
                                )}
                            </BodyBold>
                        </Col>
                    </TopInfoRow>
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
                {loading ? (
                    <Skeleton count={3} />
                ) : (
                    <MainInformation
                        gig={gig}
                        theEvent={theEvent}
                        openChat={openChat}
                        opportunityLocked={opportunityLocked}
                    />
                )}
            </Col>
        );
    }
);

const TopInfoRow = styled(Row)`
    ${BodyBold} {
        line-height: 1.5em;
        letter-spacing: 0;
    }
    @media only screen and (max-width: 450px) {
        margin-top: 9px;
        ${BodyBold} {
            font-size: 14px;
        }
    }
`;

const MainInformation = ({ gig, theEvent, openChat, opportunityLocked }) => {
    const match = useRouteMatch();

    const { showInfo, isActionable } = gig || {};
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
    } = theEvent || {};

    const startMoment = moment(start?.localDate);
    const endMoment = moment(end?.localDate);
    const hours = endMoment.diff(startMoment, 'hours');
    const date = startMoment.toDate().toLocaleDateString();

    return (
        <>
            {address && showInfo && (
                <CustomSection>
                    <TitleClean>Address</TitleClean>
                    <BodySmall>{address}</BodySmall>
                </CustomSection>
            )}
            {isActionable && !opportunityLocked && (
                <CustomSection>
                    <TitleClean>Contact {contactName}</TitleClean>

                    {!showInfo && (
                        <BodySmall>
                            Details will be available when the gig is confirmed.
                            <br />
                            <NavLink to={match.url + '/contact-get-pro'}>
                                <b style={{ color: '#4d6480' }}>Pro members</b>
                            </NavLink>{' '}
                            can see the contact details any time.
                        </BodySmall>
                    )}
                    <ContactPills
                        email={contactEmail}
                        phone={contactPhone}
                        showInfo={showInfo}
                        openChat={openChat}
                        gigId={gig?.id}
                    />
                </CustomSection>
            )}

            <CustomSection>
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
            </CustomSection>
            <CustomSection>
                <TitleClean>Budget</TitleClean>
                <BodySmall>{budget ? `Up to ${budget?.formatted}` : 'Not specified'}</BodySmall>
            </CustomSection>
            <CustomSection>
                <TitleClean>Music</TitleClean>
                <RowWrap style={{ marginRight: '-24px' }}>
                    {genres?.map((g) => (
                        <InfoBox key={g}>{g}</InfoBox>
                    ))}
                </RowWrap>
            </CustomSection>
            <CustomSection>
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
            </CustomSection>
        </>
    );
};

const CustomSection = styled.div`
    margin-bottom: 30px;
    h3 {
        margin-bottom: 0.5em;
    }
    > div {
        margin-top: 15px;
    }
`;

export default Information;
