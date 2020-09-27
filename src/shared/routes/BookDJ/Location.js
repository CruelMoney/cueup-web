import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import forwardIcon from '@iconify/icons-ion/arrow-forward';
import { useInView } from 'react-intersection-observer';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import SmartNavigation from 'components/Navigation';
import { Container, SmartButton } from 'components/Blocks';
import { Body, BodySmall, H2, H3, PageTitle } from 'components/Text';
import { GracefullPicture } from 'components/GracefullImage';
import Footer from 'components/common/Footer';
import LazyRequestForm from 'components/common/RequestForm';
import FeaturedDJCard from 'components/FeaturedDJCard';
import defaultImage from '../../assets/images/default.png';
import Map from '../../components/common/Map';
import BookDJForm from './BookDJForm';
import { HeroCard } from './Components';
import firstWeddingDance from './assets/first_wedding_dance_of_newlywed.webp';
import birthdayParty from './assets/birthday_party.webp';
import officeParty from './assets/office_party.webp';

import firstWeddingDanceJPG from './assets/first_wedding_dance_of_newlywed.jpg';
import birthdayPartyJPG from './assets/birthday_party.jpg';
import officePartyJPG from './assets/office_party.jpg';

import { ReactComponent as HipHopIcon } from './assets/icons/hiphop.svg';
import { ReactComponent as PartyLightsIcon } from './assets/icons/partyLights.svg';
import { ReactComponent as SmokeIcon } from './assets/icons/smoke.svg';
import { ReactComponent as SpeakerIcon } from './assets/icons/speaker.svg';
import { ReactComponent as VinylIcon } from './assets/icons/vinyl.svg';
import { ReactComponent as Top40Icon } from './assets/icons/top40.svg';
import heroImg from './assets/hero_1.webp';
import heroImgJPG from './assets/hero_1_compressed.jpg';
import { SEARCH } from './gql';

const Location = ({ translate, activeLocation, environment, topDjs }) => {
    const title = activeLocation.name;

    const coordinates = activeLocation.coords;

    const siteDescription = `Find and book the best DJs in ${title}. Explore the DJs and book the perfect DJ for your event.`;

    const siteTitle = `Book a DJ in ${title} · Cueup`;
    const thumb = environment.CALLBACK_DOMAIN + (activeLocation.image || defaultImage);

    const featuredDjs = topDjs.slice(0, 3);
    const otherDjs = topDjs.slice(3, 11);

    const checkAvailability = topDjs.length < 3;

    const onClickElement = (e) => {
        e.preventDefault();
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const breadCrumbs = [
        {
            url: '/',
            label: 'DJs',
        },
        {
            url: translate(appRoutes.bookDj).replace(':location', activeLocation.countrySlug),
            label: activeLocation.country,
        },
    ];
    if (activeLocation.citySlug) {
        breadCrumbs.push({
            url: translate(appRoutes.bookDj).replace(':location', activeLocation.citySlug),
            label: activeLocation.name,
        });
    }

    return (
        <>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={siteDescription} />

                <meta property="og:title" content={siteTitle} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={siteDescription} />
                <meta property="og:image" content={thumb} />

                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
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
            {featuredDjs.length >= 3 && (
                <FeaturedDjs djs={featuredDjs} activeLocation={activeLocation} />
            )}
            <Occasions onClick={onClickElement} />
            <PopularRequests activeLocation={activeLocation} onClick={onClickElement} />
            {otherDjs.length >= 4 && (
                <OtherDjs djs={otherDjs} activeLocation={activeLocation} onClick={onClickElement} />
            )}
            <TopLocations {...(activeLocation?.countryResult || activeLocation)} />
            <BreadCrumbs items={breadCrumbs} />
            <Footer
                color={'#31DAFF'}
                bgColor="transparent"
                noSkew={true}
                firstTo={translate(appRoutes.bookDj)}
                firstAction={onClickElement}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('arrange-event')}
                secondLabel={translate('apply-to-become-dj')}
                title={'Ready to start the Party?'}
                subTitle={translate('arrange-event-or-become-dj')}
            />
        </>
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
                                <span>Find DJs in</span>
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

const DJsMapped = ({ djs }) => {
    return djs.map((item, idx) => {
        return (
            <FeaturedDjWrapper
                key={item.id}
                ariaLabel={item.artistName || item.userMetadata?.firstName}
                itemScope=" "
                itemType="https://schema.org/Person"
            >
                <meta itemProp="position" content={idx + 1} />

                <FeaturedDJCard border item={item} animate={false} lazyload />
            </FeaturedDjWrapper>
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
                    <DJsMapped djs={djs} />
                </ResponsiveRow>
            </Container>
        </CustomSection>
    );
};

const OtherDjs = ({ djs, activeLocation, onClick }) => {
    return (
        <CustomSection>
            <Container>
                <H2 small>Other great DJs in {activeLocation.name}</H2>
                <ResponsiveRowFour>
                    <DJsMapped djs={djs} />
                </ResponsiveRowFour>

                <NavLink to="/" onClick={onClick} style={{ fontSize: '18px', maxWidth: 'initial' }}>
                    See all DJs in {activeLocation.name} <InlineIcon icon={forwardIcon} />
                </NavLink>
            </Container>
        </CustomSection>
    );
};

const BreadCrumbsList = styled.ol`
    margin: 0;
    padding: 0;
    list-style: none;
    li {
        display: inline-block;
    }
    a {
        padding: 0 6px;
    }
    a:hover {
        text-decoration: underline;
    }
    a.current {
        pointer-events: none;
        cursor: default;
    }
    .breadcrumb-arrow {
        pointer-events: none;
        user-select: none;
        white-space: pre-wrap;
        padding-left: 0px;
        padding-right: 0px;
        font-size: 18px;
    }
`;

const BreadCrumbs = ({ items }) => {
    return (
        <Container>
            <BreadCrumbsList
                itemScope=" "
                itemType="https://schema.org/BreadcrumbList"
                aria-label="breadcrumb"
            >
                {items.map(({ url, label }, idx) => (
                    <li
                        key={url}
                        itemProp="itemListElement"
                        itemScope=" "
                        itemType="https://schema.org/ListItem"
                    >
                        {idx > 0 && (
                            <span className="breadcrumb-arrow" aria-hidden="true">
                                {' '}
                                ›{' '}
                            </span>
                        )}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={url}
                            itemType="https://schema.org/Thing"
                            itemProp="item"
                            className={idx === items.length - 1 ? 'current' : ''}
                        >
                            <span itemProp="name">{label}</span>
                        </a>
                        <meta itemProp="position" content={idx + 1} />
                    </li>
                ))}
            </BreadCrumbsList>
        </Container>
    );
};

const FeaturedDjWrapper = styled.li`
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

const ResponsiveCell = styled.li`
    flex: 1;
    cursor: pointer;
    ${H3} {
        margin-top: 0.6em;
    }
`;

const ImageWrapper = styled.div`
    border-radius: 2.5%;
    overflow: hidden;
    position: relative;
    img,
    picture,
    div {
        position: absolute;
        object-fit: cover;
        height: 100%;
        width: 100%;
    }
    :after {
        content: '';
        display: block;
        padding-top: 100%;
    }
`;

const ResponsiveRow = styled.ol`
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(3, 1fr);
    padding: 0;
    list-style: none;

    @media only screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-row-gap: 30px;
    }
`;

const ResponsiveRowFour = styled(ResponsiveRow)`
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 30px;
    @media only screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-row-gap: 30px;
    }
`;

const OccationItem = ({ src, jpg, alt, title, description, idx, ...props }) => {
    return (
        <ResponsiveCell
            ariaLabel={description}
            itemProp="itemListElement"
            itemScope=" "
            itemType="https://schema.org/ListItem"
            {...props}
        >
            <meta itemProp="position" content={idx + 1} />
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={src} />
            <ImageWrapper>
                <GracefullPicture lazyload>
                    <source srcSet={src} type="image/webp" />
                    <source srcSet={jpg} type="image/jpeg" />
                    <img alt={alt} src={jpg} loading="lazy" />
                </GracefullPicture>
            </ImageWrapper>
            <H3 small aria-hidden="true">
                {title}
            </H3>
            <Body aria-hidden="true">{description}</Body>
        </ResponsiveCell>
    );
};

const occationData = [
    {
        src: firstWeddingDance,
        jpg: firstWeddingDanceJPG,
        alt: 'First wedding dance with glitter',
        title: 'Weddings',
        description: 'Wedding DJs that knows how to create a magical night.',
    },
    {
        src: officeParty,
        jpg: officePartyJPG,
        alt: 'First wedding dance with glitter',
        title: 'Corporate events',
        description: 'DJs that knows exactly how a corporate event should be pulled off.',
    },
    {
        src: birthdayParty,
        jpg: birthdayPartyJPG,
        alt: 'First wedding dance with glitter',
        title: 'Birthday parties',
        description: 'DJs for birthdays, anniversaries, and other private events.',
    },
];

const Occasions = ({ onClick }) => {
    return (
        <CustomSection>
            <Container>
                <H2 small>DJs for every occasion</H2>
                <Body>Get a DJ that knows what you need.</Body>
                <ResponsiveRow>
                    {occationData.map((item, idx) => (
                        <OccationItem key={idx} idx={idx} onClick={onClick} {...item} />
                    ))}
                </ResponsiveRow>
            </Container>
        </CustomSection>
    );
};

const ScrollableFullWidthGrid = styled.ol`
    display: flex;
    list-style: none;
    overflow: auto;
    margin-left: calc((100vw - 100%) / -2);
    margin-right: calc((100vw - 100%) / -2);
    padding-left: calc((100vw - 100%) / 2);
    padding-right: calc((100vw - 100%) / 2);
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: -15px;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start;
    -webkit-box-pack: start;
    &:after {
        content: '';
        padding: 16px 0;
        padding-right: calc((100vw - 100%) / 2);
    }
`;

const RequestWrapper = styled.li`
    box-shadow: 0 3px 10px 0 rgba(18, 43, 72, 0.15);
    min-width: 240px;
    padding: 1em;
    padding-bottom: 0.5em;
    border-radius: 20px;
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    &:last-child {
        margin-right: 0;
    }
`;

const RequestItem = ({ label, Icon, idx, ...props }) => {
    return (
        <RequestWrapper
            ariaLabel={label}
            itemProp="itemListElement"
            itemScope=" "
            itemType="https://schema.org/ListItem"
            {...props}
        >
            <meta itemProp="position" content={idx + 1} />
            <meta itemProp="name" content={label} />
            {/* <meta itemprop="url" content={url}></meta> */}
            <Icon />
            <H3 small aria-hidden="true" style={{ marginTop: '0.75em' }}>
                {label}
            </H3>
        </RequestWrapper>
    );
};

const requestdata = [
    {
        label: 'Top 40',
        Icon: Top40Icon,
    },
    {
        label: 'Hip Hop',
        Icon: HipHopIcon,
    },
    {
        label: 'Vinyls',
        Icon: VinylIcon,
    },
    {
        label: 'Sound system',
        Icon: SpeakerIcon,
    },
    {
        label: 'Party lights',
        Icon: PartyLightsIcon,
    },
    {
        label: 'Smoke machine',
        Icon: SmokeIcon,
    },
];

const PopularRequests = ({ activeLocation, onClick }) => {
    return (
        <CustomSection>
            <Container>
                <H2 small>Popular requests for {activeLocation.name} DJs</H2>

                <ScrollableFullWidthGrid>
                    {requestdata.map((item, idx) => (
                        <RequestItem key={idx} idx={idx} onClick={onClick} {...item} />
                    ))}
                </ScrollableFullWidthGrid>
            </Container>
        </CustomSection>
    );
};

const CustomSection = styled.section`
    margin-bottom: 60px;
    position: relative;
    width: 100%;
`;

const HeroImageWrapper = styled.div`
    width: 75%;
    height: 100%;
    border-radius: 20px;
    position: absolute;
    right: 0;
    top: 0;
    pointer-events: none;
    overflow: hidden;
    div,
    img,
    picture {
        object-fit: cover;
        height: 100%;
        width: 100%;
        display: block;
    }
    @media only screen and (max-width: 744px) {
        display: none;
    }
`;

const HeroSection = styled(CustomSection)`
    min-height: 470px;
    display: flex;
    @media only screen and (max-width: 744px) {
        min-height: 0;
        margin-top: 15px;
    }
`;

const MapWrapper = styled.div`
    border-radius: 20px;
    pointer-events: none;
    overflow: hidden;
    background-color: #fff;
    width: 100%;
    height: 470px;
    position: relative;
    box-shadow: 0 6px 65px 0 rgba(18, 43, 72, 0.15);
    @media only screen and (max-width: 744px) {
        height: 250px;
    }
`;

const TopLocationsGrid = styled.ol`
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(5, 1fr);
    padding: 0;
    list-style: none;
    a:hover {
        text-decoration: underline;
    }
    @media only screen and (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        grid-row-gap: 30px;
        grid-gap: 9px;
    }
`;

const TopLocations = ({ country, coords, radius, bounds, cities }) => {
    const { translate } = useTranslate();
    const [ref, inView] = useInView({
        rootMargin: '200px',
        triggerOnce: true,
    });

    if (!cities?.length) {
        return null;
    }

    return (
        <CustomSection style={{ marginBottom: 0 }}>
            <Container>
                <H2 small>Top locations in {country}</H2>
                <TopLocationsGrid>
                    {cities.map(({ id, city, citySlug }) => (
                        <li key={id}>
                            <a href={translate(appRoutes.bookDj).replace(':location', citySlug)}>
                                <BodySmall>{city}</BodySmall>
                            </a>
                        </li>
                    ))}
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
        />
    );
};

export default DataWrapper;
