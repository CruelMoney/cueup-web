import React from 'react';
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import forwardIcon from '@iconify/icons-ion/arrow-forward';
import { useInView } from 'react-intersection-observer';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import SmartNavigation from 'components/Navigation';
import { Container, HideBelow, SecondaryButton } from 'components/Blocks';
import { Body, BodySmall, H2, H3, PageTitle } from 'components/Text';
import { GracefullPicture } from 'components/GracefullImage';
import Footer from 'components/common/Footer';
import LazyRequestForm from 'components/common/RequestForm';
import FeaturedDJCard from 'components/FeaturedDJCard';
import TrustedBy from 'routes/Home/components/TrustedBy';
import defaultImage from '../../assets/images/default.png';
import Map from '../../components/common/Map';
import BookDJForm from './BookDJForm';
import {
    BreadCrumbs,
    CustomSection,
    HeroCard,
    HeroImageWrapper,
    HeroSection,
    MapWrapper,
    ResponsiveRow,
    ResponsiveRowFour,
    TopLocationsGrid,
} from './Components';

import heroImg from './assets/hero_1.webp';
import heroImgJPG from './assets/hero_1_compressed.jpg';
import { SEARCH } from './gql';
import Occasions from './Occassions';
import PopularRequests from './PopularRequests';

const Location = ({ translate, activeLocation, environment, topDjs, djsCounts }) => {
    const history = useHistory();

    const title = activeLocation.name;

    const coordinates = activeLocation.coords;

    const featuredDjs = topDjs.slice(0, 3);
    const otherDjs = topDjs.slice(3, 11);

    const metaDescription = `Find and book the best DJs in ${title} on Cueup DJ booking. With Cueup it’s simple to post your event and we’ll quickly match you with great DJs in ${title} for your event.`;
    const siteDescription = `Find and book the best DJs in ${title} on Cueup, the top DJ booking website trusted by thousands of event organizers. Just start searching to get started.`;

    const siteTitle = `Book a DJ in ${title} (Found +${Math.max(
        djsCounts,
        11
    )} DJs) · Cueup DJ Booking`;
    const thumb = environment.CALLBACK_DOMAIN + (activeLocation.image || defaultImage);

    const checkAvailability = topDjs.length < 3;

    const onClickElement = (state) => (e) => {
        e.preventDefault();
        if (checkAvailability) {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        } else {
            history.push({
                pathname: translate(appRoutes.search),
                state: {
                    locationName: activeLocation.name,
                    ...state,
                },
            });
        }
    };

    const breadCrumbs = [
        {
            url: translate(appRoutes.home),
            label: 'Home',
        },

        {
            url: translate(appRoutes.bookDj).replace(':location', activeLocation.countrySlug),
            label: activeLocation.country,
        },
    ];
    if (activeLocation.citySlug) {
        breadCrumbs.push({
            url:
                translate(appRoutes.search) +
                `?locationName="${activeLocation.name}"&location=${JSON.stringify({
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                })}`,
            label: activeLocation.name + ' DJs',
        });
        breadCrumbs.push({
            url: translate(appRoutes.bookDj).replace(':location', activeLocation.citySlug),
            label: activeLocation.name,
        });
    }

    return (
        <>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={metaDescription} />

                <meta property="og:title" content={siteTitle} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content={thumb} />

                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={thumb} />

                {coordinates && (
                    <meta name="geo.position" content={`${coordinates.lat}; ${coordinates.lng}`} />
                )}
                <meta name="geo.placename" content={title} />
                <meta name="geo.region" content={title} />
            </Helmet>
            <SmartNavigation dark relative />
            <Hero
                activeLocation={activeLocation}
                siteDescription={siteDescription}
                checkAvailability={checkAvailability}
            />
            <HideBelow>
                <Container>
                    <TrustedBy style={{ marginBottom: 60 }} label={false} hideMobile />
                </Container>
            </HideBelow>
            {featuredDjs.length >= 3 && (
                <FeaturedDjs djs={featuredDjs} activeLocation={activeLocation} />
            )}
            <Occasions onClick={onClickElement} />
            <PopularRequests activeLocation={activeLocation} onClick={onClickElement} />
            {otherDjs.length >= 4 && (
                <OtherDjs djs={otherDjs} activeLocation={activeLocation} onClick={onClickElement} />
            )}
            <TopLocations {...(activeLocation?.countryResult || activeLocation)} />
            <Container>
                <BreadCrumbs items={breadCrumbs} />
            </Container>
            <Footer
                color={'#31DAFF'}
                bgColor="transparent"
                noSkew={true}
                firstTo={translate(appRoutes.bookDj)}
                firstAction={onClickElement()}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('arrange-event')}
                secondLabel={translate('apply-to-become-dj')}
                title={'Ready to start the Party?'}
                subTitle={translate('arrange-event-or-become-dj')}
            />
        </>
    );
};

const DJsMapped = ({ djs, showBio }) => {
    const { translate } = useTranslate();

    return djs.map((item, idx) => {
        const { bio, firstName } = item.userMetadata || {};
        const displayName = item.artistName || firstName;
        const route = `${translate(appRoutes.user)}/${item.permalink}/overview`;

        return (
            <li key={item.id}>
                <FeaturedDjWrapper
                    ariaLabel={displayName}
                    itemScope=" "
                    itemType="https://schema.org/ListItem"
                >
                    <meta itemProp="position" content={idx + 1} />
                    <FeaturedDJCard border item={item} animate={false} lazyload />
                </FeaturedDjWrapper>
                {bio && showBio && (
                    <>
                        <Body itemProp="description" numberOfLines={4} style={{ marginTop: 12 }}>
                            {bio}
                        </Body>
                        <Body style={{ fontWeight: 600, marginTop: '1em' }}>
                            <NavLink to={route}>
                                Book {displayName} <InlineIcon icon={forwardIcon} />
                            </NavLink>
                        </Body>
                    </>
                )}
            </li>
        );
    });
};

const FeaturedDjs = ({ djs, activeLocation }) => {
    return (
        <CustomSection>
            <Container>
                <H2 small>Featured DJs in {activeLocation.name}</H2>
                <Body>Find and book the best DJs in {activeLocation.name}.</Body>
                <ResponsiveRow>
                    <DJsMapped djs={djs} showBio />
                </ResponsiveRow>
            </Container>
        </CustomSection>
    );
};

const OtherDjs = ({ djs, activeLocation, onClick }) => {
    if (djs.length % 4 !== 0) {
        djs = djs.slice(0, 4);
    }

    return (
        <CustomSection>
            <Container>
                <H2 small>Other great DJs in {activeLocation.name}</H2>
                <ResponsiveRowFour>
                    <DJsMapped djs={djs} />
                </ResponsiveRowFour>

                <NavLink
                    to="/"
                    onClick={onClick()}
                    style={{ fontSize: '18px', maxWidth: 'initial' }}
                >
                    See all DJs in {activeLocation.name} <InlineIcon icon={forwardIcon} />
                </NavLink>
            </Container>
        </CustomSection>
    );
};

const Hero = ({ activeLocation, siteDescription, checkAvailability }) => {
    const { name, coords, city } = activeLocation;
    return (
        <Container>
            <HeroSection>
                <HeroCard>
                    <Switch>
                        <Route
                            path="*/form"
                            render={() => (
                                <div style={{ marginTop: '-12px' }}>
                                    <LazyRequestForm transparent fromNewSearch />
                                </div>
                            )}
                        />

                        <div>
                            <PageTitle small>
                                <span>Book DJs in </span>
                                {name}
                            </PageTitle>
                            <BodySmall style={{ marginBottom: '0.7em' }}>
                                {siteDescription}
                            </BodySmall>
                            <BookDJForm
                                checkAvailability={checkAvailability}
                                activeLocation={activeLocation}
                            />
                        </div>
                    </Switch>
                </HeroCard>

                <HeroImageWrapper>
                    <GracefullPicture lazyload>
                        <source srcSet={heroImg} type="image/webp" />
                        <source srcSet={heroImgJPG} type="image/jpeg" />
                        <img
                            alt="Female DJ playing vinyls"
                            src={heroImgJPG}
                            style={{ borderRadius: '20px' }}
                            loading="lazy"
                        />
                    </GracefullPicture>
                </HeroImageWrapper>
            </HeroSection>
        </Container>
    );
};

const FeaturedDjWrapper = styled.div`
    font-size: 100px;
    position: relative;
    > * {
        position: absolute;
        left: 0;
        top: 0;
    }
    :after {
        content: '';
        display: block;
        padding-top: 115%;
    }
`;

const TopLocations = ({ country, coords, radius, bounds, cities }) => {
    const { translate } = useTranslate();
    const { pathname } = useLocation();

    const [ref, inView] = useInView({
        rootMargin: '200px',
        triggerOnce: true,
    });

    if (!cities?.length) {
        return null;
    }

    const maxLength = pathname.includes('book-dj/all') ? cities.length : 50;
    const showMore = cities.length > maxLength;

    return (
        <CustomSection style={{ marginBottom: 0 }}>
            <Container>
                <H2 small>Top locations in {country}</H2>
                <TopLocationsGrid>
                    {cities.slice(0, maxLength).map(({ id, city, citySlug, countrySlug }, idx) =>
                        idx === maxLength - 1 && showMore ? (
                            <li key={'show-more'}>
                                <a
                                    href={
                                        translate(appRoutes.bookDj).replace(
                                            ':location',
                                            countrySlug
                                        ) + '/all'
                                    }
                                >
                                    <BodySmall>Show all</BodySmall>
                                </a>
                            </li>
                        ) : (
                            <li key={id}>
                                <a
                                    href={translate(appRoutes.bookDj).replace(
                                        ':location',
                                        citySlug
                                    )}
                                >
                                    <BodySmall>{city}</BodySmall>
                                </a>
                            </li>
                        )
                    )}
                </TopLocationsGrid>
                {coords && (
                    <MapWrapper ref={ref}>
                        {inView && (
                            <Map
                                noCircle={true}
                                hideRoads={true}
                                radius={radius}
                                defaultCenter={coords}
                                height={'100%'}
                                value={coords}
                                editable={false}
                                radiusName="playingRadius"
                                locationName="playingLocation"
                                bounds={bounds}
                                largeScale
                            />
                        )}
                    </MapWrapper>
                )}
            </Container>
        </CustomSection>
    );
};

const DataWrapper = (props) => {
    const { translate } = useTranslate();
    const { environment, data } = useServerContext();
    const { activeLocation } = data || {};
    const { coords } = activeLocation || {};

    const filter = {};

    if (activeLocation) {
        if (activeLocation.citySlug) {
            filter.location = {
                latitude: coords?.lat,
                longitude: coords?.lng,
            };
        } else {
            filter.countryCode = activeLocation.iso2;
        }
    }

    const { data: searchData } = useQuery(SEARCH, {
        skip: !coords,
        variables: {
            pagination: {
                orderBy: 'UPDATED_AT_DESCENDING',
                page: 1,
                limit: 11,
            },
            filter,
        },
    });

    const topDjs = searchData?.searchDjs?.edges || [];
    const djsCounts = searchData?.searchDjs?.pageInfo.totalDocs;

    if (!activeLocation) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    return (
        <Location
            {...props}
            translate={translate}
            activeLocation={activeLocation}
            environment={environment}
            topDjs={topDjs}
            djsCounts={djsCounts}
        />
    );
};

export default DataWrapper;
