import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Navigation from '../../../components/SubNavigation';
import Rating from '../../../components/common/Rating';
import VerifiedBadge from '../../../components/graphics/VerifiedBadge';
import Tooltip from '../../../components/Tooltip';
import {
    Container,
    FullWidthCol,
    Row,
    ShowBelow,
    Col,
    Avatar,
    GradientBg,
} from '../../../components/Blocks';
import { Spacing } from '../../../components/Sidebar';
import { HeaderTitle } from '../../../components/Text';
import ConditionalWrap from '../../../components/ConditionalWrap';
import useWindowSize from '../../../components/hooks/useWindowSize';
import { Stats, CertifiedVerified } from './Common';

const getRoutesFromUser = (user, pathname) => {
    const routes = [{ route: 'overview', label: 'overview', active: true }];

    if (user) {
        const roles = user.appMetadata.roles;

        routes.push({ route: 'photos', label: 'photos' });

        if (roles.includes('ORGANIZER')) {
            if (user.isOwn) {
                routes.push({ route: 'events', label: 'events' });
            }
        }

        if (roles.includes('DJ')) {
            routes.push({ route: 'sounds', label: 'sounds' });
            if (user.isOwn) {
                routes.push({ route: 'gigs', label: 'gigs' });
            }
            if (user.reviews.pageInfo.totalDocs > 0 || user.isOwn) {
                routes.push({ route: 'reviews', label: 'reviews' });
            }
        }

        if (user.isOwn) {
            routes.push({ route: 'settings', label: 'settings' });
        }
    }

    return routes.map((r) => ({ ...r, route: pathname + '/' + r.route }));
};

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

const Header = ({ user, loading, pathname, children }) => {
    return (
        <GradientBg coverPhoto={user && user.coverPhoto}>
            <Container>
                {children}
                <Row className="wrapper">
                    <HeaderSpacing />
                    <FullWidthCol>
                        {loading ? null : <UserContent user={user} />}
                        <Navigation routes={getRoutesFromUser(user, pathname)} />
                    </FullWidthCol>
                </Row>
            </Container>
        </GradientBg>
    );
};

const StatsWrapper = styled.div`
    margin-top: 48px;

    @media only screen and (max-width: 425px) {
        margin-top: 24px;
    }
`;

const HeaderWrapper = styled.div`
    padding-bottom: 48px;

    @media only screen and (max-width: 425px) {
        padding-bottom: 24px;
    }
`;

const UserContent = ({ user }) => {
    const { artistName, userMetadata, appMetadata, reviews } = user;
    const { firstName } = userMetadata;
    const { certified, rating, identityVerified, experience, followers } = appMetadata;

    const { width } = useWindowSize();

    return (
        <ConditionalWrap
            condition={width <= 768}
            wrap={(children) => <NavLink to={'overview'}>{children}</NavLink>}
        >
            <HeaderWrapper>
                <Row middle>
                    <Col style={{ flex: 1, alignItems: 'flex-start' }}>
                        <HeaderTitle>
                            {artistName || firstName}
                            {certified && (
                                <Tooltip
                                    text={
                                        'This dj has been certified by Cueup. The Cueup team has personally met and seen this dj play.'
                                    }
                                >
                                    {({ ref, close, open }) => (
                                        <VerifiedBadge
                                            ref={ref}
                                            style={{ marginLeft: '15px' }}
                                            onMouseEnter={open}
                                            onMouseLeave={close}
                                        />
                                    )}
                                </Tooltip>
                            )}
                        </HeaderTitle>
                        {rating && (
                            <div>
                                <RatingWrapper>
                                    <Rating
                                        color={'#fff'}
                                        emptyColor={'#ffffff99'}
                                        rating={rating}
                                    />
                                </RatingWrapper>
                                <ReviewsCount>{reviews.pageInfo.totalDocs} reviews</ReviewsCount>
                            </div>
                        )}

                        {(experience || followers) && (
                            <ShowBelow width={425}>
                                <StatsWrapper>
                                    <Stats
                                        white
                                        experience={experience}
                                        followers={followers}
                                        marginRight={'15px'}
                                    />
                                </StatsWrapper>
                            </ShowBelow>
                        )}
                    </Col>
                    <ShowBelow width={425}>
                        <Col>
                            <Avatar size="extraLarge" src={user.picture.path} />
                        </Col>
                    </ShowBelow>
                </Row>
                <ShowBelow width={425} style={{ marginTop: '24px' }}>
                    <Row>
                        <CertifiedVerified
                            certified={certified}
                            identityVerified={identityVerified}
                        />
                    </Row>
                </ShowBelow>
            </HeaderWrapper>
        </ConditionalWrap>
    );
};

export default Header;
