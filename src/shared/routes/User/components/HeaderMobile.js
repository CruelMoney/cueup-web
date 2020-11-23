import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { ProFeature } from 'components/FormComponents';
import GracefullImage from 'components/GracefullImage';
import { Container, FullWidthCol, Row, Col, GradientBg, Hr } from '../../../components/Blocks';
import { HeaderTitle, BodyBold, Title, TitleClean } from '../../../components/Text';

import { UserInfo, UserRating } from './Common';
import BookingButton from './BookingButton';

const StatusButton = styled.button`
    background: rgba(255, 255, 255, 0.4);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    padding: 0.5em 1.2em;
    border-radius: 2em;
`;

const HeaderMobile = (props) => {
    const { user, loading, children, bookingEnabled } = props;
    const { artistName, userMetadata, appMetadata, reviews } = user;
    const { firstName } = userMetadata;
    const { rating, isPro } = appMetadata;

    return (
        <>
            <GradientBg
                isPro={user?.appMetadata.isPro}
                coverPhoto={user && user.coverPhoto}
                style={{ marginBottom: 30, paddingTop: 100 }}
            >
                <Container>
                    {children}
                    <Row className="wrapper">
                        <FullWidthCol>{loading ? null : <UserContent {...props} />}</FullWidthCol>
                    </Row>
                </Container>
            </GradientBg>
            <Container style={{ marginBottom: 30 }}>
                <Col center>
                    <NavLink to={'overview'} style={{ textAlign: 'center' }}>
                        <HeaderTitle dark>
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
                    </NavLink>

                    <UserRating
                        dark
                        reviews={reviews}
                        rating={rating}
                        style={{ marginTop: 12, marginBottom: 15 }}
                    />

                    {bookingEnabled && (
                        <BookingButton
                            user={user}
                            noIcon
                            buttonStyle={{
                                margin: '0 0 30px',
                                width: '100%',
                                height: 50,
                                textAlign: 'center',
                                paddingLeft: 0,
                            }}
                        />
                    )}
                    <Hr />
                </Col>
            </Container>
        </>
    );
};

const HeaderWrapper = styled.div``;

const UserContent = ({ user, statusLabel, setShowing }) => {
    return (
        <HeaderWrapper>
            <Col style={{ flex: 1, alignItems: 'center' }}>
                {user.isDj && !!statusLabel && (
                    <StatusButton onClick={() => setShowing(true)} style={{ marginBottom: 24 }}>
                        <BodyBold white>{statusLabel} - read more</BodyBold>
                    </StatusButton>
                )}
                <NavLink to={'overview'} style={{ textAlign: 'center' }}>
                    <ProfileImage src={user.picture.path} />
                </NavLink>
            </Col>
        </HeaderWrapper>
    );
};

const ProfileImage = ({ src, style, ...props }) => {
    return (
        <div
            style={{
                height: '200px',
                width: '200px',
                minHeight: '200px',
                minWidth: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '6px solid white',
                marginBottom: '-30px',
                backgroundColor: 'white',
                ...style,
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

export default HeaderMobile;
