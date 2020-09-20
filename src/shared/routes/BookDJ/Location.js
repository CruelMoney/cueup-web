import React from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import SmartNavigation from 'components/Navigation';
import { Container, RowMobileCol } from 'components/Blocks';
import { Body, H2, H3, PageTitle } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import Footer from 'components/common/Footer';
import defaultImage from '../../assets/images/cities/default.png';
import Map from '../../components/common/Map';
import BookDJForm from './BookDJForm';
import { HeroCard } from './Components';
import firstWeddingDance from './assets/first_wedding_dance_of_newlywed.webp';
import birthdayParty from './assets/birthday_party.webp';
import officeParty from './assets/office_party.webp';

const Location = ({ translate, activeLocation, environment, match }) => {
    const { location } = match.params;

    const title = activeLocation.name;

    const coordinates = activeLocation.coords;

    const siteDescription = translate('location:description', {
        location: activeLocation.name,
    });

    const siteTitle = translate('location:title', { location: title });
    const thumb = environment.CALLBACK_DOMAIN + (activeLocation.image || defaultImage);

    return (
        <>
            <Helmet>
                <title>{siteTitle + ' | Cueup'}</title>
                <meta name="description" content={siteDescription} />

                <meta property="og:title" content={siteTitle + ' | Cueup'} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={siteDescription} />
                <meta property="og:image" content={thumb} />

                <meta name="twitter:title" content={siteTitle + ' | Cueup'} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:image" content={thumb} />

                {coordinates && (
                    <meta name="geo.position" content={`${coordinates.lat}; ${coordinates.lng}`} />
                )}
                <meta name="geo.placename" content={title} />
                <meta name="geo.region" content={title} />
            </Helmet>
            <SmartNavigation dark relative />
            <Hero activeLocation={activeLocation} />
            <Occasions />

            <Footer
                color={'#31DAFF'}
                noSkew={true}
                firstTo={translate(appRoutes.home)}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('arrange-event')}
                secondLabel={translate('apply-to-become-dj')}
                title={translate('ready-to-get-started')}
                subTitle={translate('arrange-event-or-become-dj')}
            />
        </>
    );
};

const Hero = ({ activeLocation }) => {
    const { name, coords, city } = activeLocation;
    return (
        <Container>
            <HeroSection>
                <HeroCard>
                    <PageTitle>
                        <span>Find DJs in</span>
                        {name}
                    </PageTitle>
                    <Body>Find and book the best DJs near {name}.</Body>
                    <BookDJForm />
                </HeroCard>
                {coords && (
                    <MapWrapper>
                        <Map
                            noCircle={!city}
                            hideRoads={true}
                            radius={activeLocation.radius}
                            defaultCenter={coords}
                            height={470}
                            value={coords}
                            editable={false}
                            radiusName="playingRadius"
                            locationName="playingLocation"
                            bounds={activeLocation.bounds}
                        />
                    </MapWrapper>
                )}
            </HeroSection>
        </Container>
    );
};

const ResponsiveCell = styled.li`
    flex: 1;
    ${H3} {
        margin-top: 0.6em;
    }
`;

const ImageWrapper = styled.div`
    border-radius: 2.5%;
    overflow: hidden;
    position: relative;
    > * {
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

const OccationItem = ({ src, alt, title, description, idx }) => {
    return (
        <ResponsiveCell
            ariaLabel={description}
            itemprop="itemListElement"
            itemscope=""
            itemtype="https://schema.org/ListItem"
        >
            <meta itemProp="position" content={idx + 1} />
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={src} />
            {/* <meta itemprop="url" content={url}></meta> */}
            <ImageWrapper>
                <GracefullImage animate src={src} alt={alt} />
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
        alt: 'First wedding dance with glitter',
        title: 'Weddings',
        description: 'Wedding DJs that knows how to create a magical night.',
    },
    {
        src: officeParty,
        alt: 'First wedding dance with glitter',
        title: 'Corporate events',
        description: 'DJs that knows exactly how a corporate event should be pulled off.',
    },
    {
        src: birthdayParty,
        alt: 'First wedding dance with glitter',
        title: 'Birthday parties',
        description: 'DJs for birthdays, anniversaries, and other private events.',
    },
];

const Occasions = () => {
    return (
        <CustomSection>
            <Container>
                <H2 small>DJs for every occasion</H2>
                <Body>Get a DJ that knows what you need.</Body>
                <ResponsiveRow>
                    {occationData.map((item, idx) => (
                        <OccationItem key={idx} idx={idx} {...item} />
                    ))}
                </ResponsiveRow>
            </Container>
        </CustomSection>
    );
};

const DataWrapper = (props) => {
    const { translate } = useTranslate();
    const { environment, data } = useServerContext();
    const { activeLocation } = data || {};

    if (!activeLocation) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    return (
        <Location
            {...props}
            translate={translate}
            activeLocation={activeLocation}
            environment={environment}
        />
    );
};

const CustomSection = styled.section`
    margin-bottom: 60px;
    position: relative;
    width: 100%;
`;

const MapWrapper = styled.div`
    width: 75%;
    height: 100%;
    border-radius: 20px;
    position: absolute;
    right: 0;
    top: 0;
    box-shadow: 0 3px 10px 0 rgba(18, 43, 72, 0.15);
    pointer-events: none;
    overflow: hidden;
`;

const HeroSection = styled(CustomSection)`
    height: 470px;
`;

export default DataWrapper;