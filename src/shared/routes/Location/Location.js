import React, { useRef, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import useScript from '@charlietango/use-script';
import GeoCoder from 'utils/GeoCoder';
import {
    PrimaryButton,
    Row,
    Container,
    Col,
    RowMobileCol,
    CardSimple,
    CardInfo,
    ShowBelow,
} from 'components/Blocks';
import { Body } from 'components/Text';

import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { useServerContext } from 'components/hooks/useServerContext';
import Footer from '../../components/common/Footer';

import Map from '../../components/common/Map';
import citySvg from '../../assets/City.svg';
import AsyncRequestForm from '../../components/common/RequestForm';
import defaultImage from '../../assets/images/cities/default.png';
import FloatingDJs from './components/FloatingCards';
import { CitiesList } from './components/CountriesList';
import content from './content.json';
import './index.css';

const HeroCard = styled(CardSimple)`
    padding: 30px;
`;

const Location = (props) => {
    const secondColor = '#25F4D2';
    const themeColor = '#31DAFF';
    const requestForm = useRef();
    const [isMobile, setIsMobile] = useState(false);

    const { translate, activeLocation, environment } = props;

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    const handleButtonClick = () => {
        window.scroll({
            top: requestForm.current.offsetTop - 20,
            left: 0,
            behavior: 'smooth',
        });
    };

    const { match } = props;
    const { city, country } = match.params;

    const title = activeLocation.name;

    const coordinates = activeLocation.coords;

    const siteDescription = translate('location:description', {
        location: activeLocation.name,
    });

    const siteTitle = translate('location:title', { location: title });
    const thumb = environment.CALLBACK_DOMAIN + (activeLocation.image || defaultImage);

    return (
        <div className="locations-page">
            <Helmet>
                <title>{siteTitle + ' | Cueup'}</title>
                <body className="book-dj-location white-theme" />
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
            <div className="span-wrapper">
                <header
                    style={{
                        height: isMobile ? '500px' : '600px',
                        backgroundColor: '#ebebeb',
                    }}
                >
                    {coordinates && (
                        <Map
                            key={title}
                            noCircle={!city}
                            hideRoads={true}
                            offsetCenter
                            radius={activeLocation.radius}
                            defaultCenter={coordinates}
                            height={isMobile ? 500 : 600}
                            value={coordinates}
                            editable={false}
                            themeColor={themeColor}
                            radiusName="playingRadius"
                            locationName="playingLocation"
                            bounds={activeLocation.bounds}
                        />
                    )}

                    <article>
                        <Container className="container fix-top-mobile">
                            <GoogleMapsLogo />

                            <Row className="row">
                                <HeroContent>
                                    <HeroCard className="card">
                                        <h1
                                            key="title"
                                            dangerouslySetInnerHTML={{
                                                __html: translate('location:title-2', {
                                                    location: title,
                                                }),
                                            }}
                                        />
                                        <Body key="paragraph" style={{ lineHeight: 1.75 }}>
                                            {siteDescription}
                                        </Body>

                                        <div style={{ float: 'left', marginTop: '20px' }}>
                                            <PrimaryButton active onClick={handleButtonClick}>
                                                <div style={{ width: '150px', color: themeColor }}>
                                                    {translate('get-offers')}
                                                </div>
                                            </PrimaryButton>
                                        </div>
                                    </HeroCard>
                                </HeroContent>
                            </Row>
                        </Container>
                    </article>
                </header>
                <ShowBelow width={768} className="tablet-header-content">
                    <Container className="container">
                        <Row className="row">
                            <Body style={{ color: '#fff' }} key="paragraph">
                                {siteDescription}
                            </Body>
                        </Row>
                    </Container>
                </ShowBelow>
                <Container className="container">
                    <FormRow center>
                        <div ref={requestForm} />
                        <AsyncRequestForm
                            initialCity={
                                (activeLocation.city ? activeLocation.city + ', ' : '') +
                                activeLocation.country
                            }
                            key={title}
                        />
                    </FormRow>

                    <CitiesList
                        cities={activeLocation.cities}
                        country={activeLocation.name}
                        countrySlug={country}
                    />
                </Container>

                <img id="city-illustration" src={citySvg} />
            </div>

            <FloatingDJs {...translate(['copenhagen', 'denmark'])} location={title} />

            <Footer
                color={secondColor}
                firstTo={translate(appRoutes.signUp)}
                secondTo={translate(appRoutes.howItWorks)}
                firstLabel={translate('apply-to-become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('are-you-a-dj-in-location', { location: title })}
                subTitle={translate('apply-to-become-dj-or-see-how-it-works')}
            />
        </div>
    );
};

const BottomCol = styled(Col)`
    max-width: 480px;
`;

const HeroContent = styled.div`
    max-width: 480px;
    z-index: 999;
`;

const GoogleMapsLogoWrapper = styled.div`
    transform: translateX(-100%);
    width: 100%;
    position: absolute;
    left: 270px;
    height: 100%;
    justify-content: flex-end;
    align-items: flex-end;
    display: flex;
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

const GoogleMapsLogo = () => (
    <GoogleMapsLogoWrapper>
        <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://maps.google.com/maps?ll=55.7286,12.0635&amp;z=9&amp;t=m&amp;hl=en-US&amp;gl=US&amp;mapclient=apiv3"
            title="Open this area in Google Maps (opens a new window)"
        >
            <div>
                <img
                    style={{ width: '66px', height: '26px' }}
                    alt=""
                    src="https://maps.gstatic.com/mapfiles/api-3/images/google_white5_hdpi.png"
                    draggable="false"
                />
            </div>
        </a>
    </GoogleMapsLogoWrapper>
);

const FormRow = styled(Row)`
    padding-left: 200px;
    margin-bottom: 100px;
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
`;

const DataWrapper = (props) => {
    const { environment, data } = useServerContext();
    const { translate } = useNamespaceContent(content, 'location');

    const { activeLocation } = data || {};
    // Redirect
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

// eslint-disable-next-line import/no-unused-modules
export default DataWrapper;
