import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ProFeature } from 'components/FormComponents';
import GracefullImage from 'components/GracefullImage';
import Navigation from '../../../components/Navigation/SubNavigation';
import Rating from '../../../components/common/Rating';
import {
    Container,
    FullWidthCol,
    Row,
    Col,
    Avatar,
    GradientBg,
    TeritaryButton,
    SecondaryButton,
    Hr,
} from '../../../components/Blocks';
import { Spacing } from '../../../components/Sidebar';
import { HeaderTitle, BodyBold } from '../../../components/Text';

import { Stats, CertifiedVerified } from './Common';
import BookingButton from './BookingButton';

const ReviewsCount = styled.p`
    opacity: 0.6;
    font-size: 15px;
    color: #ffffff;
    display: inline-block;
    margin-left: 9px;
    margin-bottom: 0;
    font-weight: 600;
    @media only screen and (max-width: 425px) {
        font-size: 12px;
        margin-left: 3px;
    }
`;

const RatingWrapper = styled.div`
    display: inline-block;

    @media only screen and (max-width: 425px) {
        .ratingStar {
            padding-left: 2px;
            padding-right: 2px;
            svg {
                width: 13px;
                height: 13px;
            }
        }
    }
`;

const HeaderSpacing = styled(Spacing)`
    margin-right: 60px;
    @media only screen and (max-width: 768px) {
        margin-right: 30px;
    }
`;

const StatusButton = styled.button`
    background: rgba(255, 255, 255, 0.4);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    padding: 0.5em 1.2em;
    border-radius: 2em;
`;

const HeaderMobile = (props) => {
    const { user, loading, children, routes } = props;
    const { artistName, userMetadata, appMetadata, reviews } = user;
    const { firstName } = userMetadata;
    const {
        certified,
        rating,
        identityVerified,
        experience,
        followers,

        isPro,
    } = appMetadata;

    return (
        <>
            <GradientBg
                isPro={user?.appMetadata.isPro}
                coverPhoto={user && user.coverPhoto}
                style={{ marginBottom: 75, paddingTop: 100 }}
            >
                <Container>
                    {children}
                    <Row className="wrapper">
                        <HeaderSpacing />
                        <FullWidthCol>
                            {loading ? null : <UserContent {...props} />}
                            {/* <Navigation routes={routes} /> */}
                        </FullWidthCol>
                    </Row>
                </Container>
            </GradientBg>
            <Container style={{ marginBottom: 30 }}>
                <Col center>
                    <HeaderTitle dark style={{ textAlign: 'center' }}>
                        {artistName || firstName}
                        {isPro && (
                            <ProFeature
                                disabled
                                style={{
                                    top: -4,
                                }}
                            >
                                Pro
                            </ProFeature>
                        )}
                    </HeaderTitle>

                    {(identityVerified || certified) && (
                        <TwoCol style={{ marginTop: 15 }}>
                            <CertifiedVerified
                                certified={certified}
                                identityVerified={identityVerified}
                            />
                        </TwoCol>
                    )}
                    <BookingButton
                        user={user}
                        noIcon
                        buttonStyle={{
                            margin: '15px 0 30px',
                            width: '100%',
                            height: 50,
                            textAlign: 'center',
                            paddingLeft: 0,
                        }}
                    />
                    <Hr />
                </Col>
            </Container>
        </>
    );
};

const HeaderWrapper = styled.div``;

const UserContent = ({ user, statusLabel, setShowing }) => {
    const { artistName, userMetadata, appMetadata, reviews } = user;
    const { firstName } = userMetadata;
    const {
        certified,
        rating,
        identityVerified,
        experience,
        followers,

        isPro,
    } = appMetadata;

    return (
        <HeaderWrapper>
            <Col style={{ flex: 1, alignItems: 'center' }}>
                {user.isDj && !!statusLabel && (
                    <StatusButton onClick={() => setShowing(true)} style={{ marginBottom: 24 }}>
                        <BodyBold white>{statusLabel} - read more</BodyBold>
                    </StatusButton>
                )}

                <ProfileImage src={user.picture.path} />
            </Col>
        </HeaderWrapper>
    );
};

const ProfileImage = ({ src, ...props }) => {
    return (
        <div
            style={{
                height: '150px',
                width: '150px',
                minHeight: '150px',
                minWidth: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '6px solid white',
                marginBottom: '-75px',
                backgroundColor: 'white',
            }}
        >
            <GracefullImage
                {...props}
                src={src}
                style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#EFF2F5',
                }}
            />
        </div>
    );
};

const TwoCol = styled.div`
    column-count: 2;
`;

export default HeaderMobile;
