import React from 'react';
import styled from 'styled-components';
import { ProFeature } from 'components/FormComponents';
import Navigation from '../../../components/Navigation/SubNavigation';
import Rating from '../../../components/common/Rating';
import { Container, FullWidthCol, Row, Col, GradientBg } from '../../../components/Blocks';
import { Spacing } from '../../../components/Sidebar';
import { HeaderTitle, BodyBold } from '../../../components/Text';

const ReviewsCount = styled.p`
    opacity: 0.6;
    font-size: 15px;
    color: #ffffff;
    display: inline-block;
    margin-left: 9px;
    margin-bottom: 0;
    font-weight: 600;
`;

const RatingWrapper = styled.div`
    display: inline-block;
`;

const HeaderSpacing = styled(Spacing)`
    margin-right: 60px;
    @media only screen and (max-width: 990px) {
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

const HeaderDesktop = (props) => {
    const { user, loading, children, routes } = props;
    return (
        <GradientBg
            isPro={user?.appMetadata.isPro}
            coverPhoto={user && user.coverPhoto}
            style={{
                marginBottom: 42,
            }}
        >
            <Container>
                {children}
                <Row className="wrapper">
                    <HeaderSpacing />
                    <FullWidthCol>
                        {loading ? null : <UserContent {...props} />}
                        <Navigation routes={routes} />
                    </FullWidthCol>
                </Row>
            </Container>
        </GradientBg>
    );
};

const HeaderWrapper = styled.div`
    padding-bottom: 48px;
`;

const UserContent = ({ user, statusLabel, setShowing }) => {
    const { artistName, userMetadata, appMetadata, reviews } = user;
    const { firstName } = userMetadata;
    const { rating, isPro } = appMetadata;

    return (
        <HeaderWrapper>
            <Row middle>
                <Col style={{ flex: 1, alignItems: 'flex-start' }}>
                    {user.isDj && !!statusLabel && (
                        <StatusButton onClick={() => setShowing(true)}>
                            <BodyBold white>{statusLabel} - read more</BodyBold>
                        </StatusButton>
                    )}
                    <HeaderTitle>
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
                    {rating && (
                        <div>
                            <RatingWrapper>
                                <Rating color={'#fff'} emptyColor={'#ffffff99'} rating={rating} />
                            </RatingWrapper>
                            <ReviewsCount>{reviews.pageInfo.totalDocs} reviews</ReviewsCount>
                        </div>
                    )}
                </Col>
            </Row>
        </HeaderWrapper>
    );
};

export default HeaderDesktop;
