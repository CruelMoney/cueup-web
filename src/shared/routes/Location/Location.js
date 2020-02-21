import React, { useRef, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import useScript from '@charlietango/use-script';
import GeoCoder from 'utils/GeoCoder';
import { PrimaryButton, Row } from 'components/Blocks';
import Footer from '../../components/common/Footer';
import MoneyIcon from '../../components/graphics/Money';
import NoteIcon from '../../components/graphics/Note';
import Map from '../../components/common/Map';
import citySvg from '../../assets/City.svg';
import addTranslate from '../../components/higher-order/addTranslate';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import AsyncRequestForm from '../../components/common/RequestForm';
import defaultImage from '../../assets/images/cities/default.png';
import FloatingDJs from './components/FloatingCards';
import content from './content.json';
import './index.css';
import { countries } from './locations';
import { CitiesList } from './components/CountriesList';

const Location = (props) => {
    const secondColor = '#25F4D2';
    const themeColor = '#31DAFF';
    const requestForm = useRef();
    const [isMobile, setIsMobile] = useState(false);

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

    const { match, translate } = props;
    const { city, country } = match.params;
    let location = null;
    let initialCoordinates = null;
    let title = null;
    if (city) {
        location = countries[country]?.cities?.find((c) => c.slug === city);
        const { lat, ln: lng } = location || {};
        initialCoordinates = {};
        initialCoordinates.lat = parseFloat(lat);
        initialCoordinates.lng = parseFloat(lng);
        title = location?.cityascii;
    } else {
        location = countries[country];
        title = location?.name;
    }
    const [loaded] = useScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );
    const [coordinates, setCoordinates] = useState(initialCoordinates);
    useEffect(() => {
        if (!city && loaded) {
            GeoCoder.codeAddress(title, ({ position }) => {
                position && setCoordinates(position);
            });
        }
    }, [city, initialCoordinates, loaded, title]);

    useEffect(() => {
        if (initialCoordinates && coordinates.lat !== initialCoordinates.lat) {
            setCoordinates(initialCoordinates);
        }
    }, [coordinates, initialCoordinates]);

    // Redirect
    if (!location) {
        return <Redirect to={translate('routes./not-found')} />;
    }

    const radius = city ? 25000 : isMobile ? 200000 : 100000;

    const siteDescription = translate('location.description', {
        location: title,
    });

    const siteTitle = translate('location.title', { location: title });
    const thumb = Environment.CALLBACK_DOMAIN + (location.image || defaultImage);

    return (
        <div className="locations-page">
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
            <ScrollToTop />
            <div className="span-wrapper">
                <header
                    style={{
                        height: isMobile ? '700px' : '600px',
                        backgroundColor: '#ebebeb',
                    }}
                >
                    {coordinates && (
                        <Map
                            key={title}
                            noCircle={!city || location.noCircle}
                            hideRoads={true}
                            radius={radius}
                            defaultCenter={{
                                lat: coordinates.lat + (isMobile ? 0 : 0.05),
                                lng: coordinates.lng - (isMobile ? 0 : city ? 0.5 : 2),
                            }}
                            height={isMobile ? 700 : 600}
                            value={coordinates}
                            editable={false}
                            themeColor={themeColor}
                            radiusName="playingRadius"
                            locationName="playingLocation"
                        />
                    )}

                    <article>
                        <div className="container fix-top-mobile">
                            <div className="row">
                                <div className="col-md-5 col-sm-6">
                                    <div className="card">
                                        <h1 key="title">
                                            {translate('location.title-2', { location: title })}
                                        </h1>
                                        <p key="paragraph">{siteDescription}</p>

                                        <div style={{ float: 'left', marginTop: '20px' }}>
                                            <PrimaryButton active onClick={handleButtonClick}>
                                                <div style={{ width: '150px', color: themeColor }}>
                                                    {translate('get-offers')}
                                                </div>
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="show-tablet-down">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <p key="paragraph">{siteDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </header>

                <div className="container">
                    <FormRow center>
                        <div ref={requestForm} />
                        <AsyncRequestForm initialCity={title} key={title} />
                    </FormRow>

                    {!city && location?.cities?.length > 1 && (
                        <CitiesList
                            cities={location.cities}
                            country={location}
                            countrySlug={country}
                        />
                    )}
                </div>

                <img id="city-illustration" src={citySvg} />
            </div>

            <FloatingDJs {...translate(['copenhagen', 'denmark'])} location={title} />

            <div className="info-boxes grey">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-5 col-md-push-1">
                            <div className="card">
                                <NoteIcon altGradient={false} />
                                <h2 style={{ color: themeColor }}>
                                    {translate('location.sections.left.header')}
                                </h2>
                                <p>
                                    {translate('location.sections.left.content', {
                                        location: title,
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-5 col-md-push-1">
                            <div className="card">
                                <MoneyIcon altGradient={false} />
                                <h2 style={{ color: themeColor }}>
                                    {translate('location.sections.right.header')}
                                </h2>
                                <p>
                                    {translate('location.sections.right.content', {
                                        location: title,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer
                bgColor="#FFFFFF"
                color={secondColor}
                firstTo={translate('routes./signup')}
                secondTo={translate('routes./how-it-works')}
                firstLabel={translate('apply-to-become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('are-you-a-dj-in-:location', { location: title })}
                subTitle={translate('apply-to-become-dj-or-see-how-it-works')}
            />
        </div>
    );
};

const FormRow = styled(Row)`
    padding-left: 200px;
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
`;

export default addTranslate(Location, content);
