import React from 'react';
import { Helmet } from 'react-helmet-async';
import useTranslate from 'components/hooks/useTranslate';

import { appRoutes } from 'constants/locales/appRoutes';
import Footer from '../../components/common/Footer';

import Map from '../../components/common/Map';
import citySvg from '../../assets/City.svg';
import ScrollToTop from '../../components/common/ScrollToTop';
import './index.css';
import { countries } from './locations';
import CountriesList from './components/CountriesList';

const Location = () => {
    const themeColor = '#31DAFF';
    const secondColor = '#25F4D2';
    const { translate } = useTranslate();
    const title = translate('locationsOverview.title');
    const description = translate('locationsOverview.description');

    // useEffect(() => {
    //     window.countries = countries;
    // }, []);

    return (
        <div className="locations-page">
            <Helmet>
                <body className="book-dj-location white-theme" />

                <title>{title + ' | Cueup'}</title>
                <meta name="description" content={description} />

                <meta property="og:title" content={title + ' | Cueup'} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={description} />

                <meta name="twitter:title" content={title + ' | Cueup'} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <ScrollToTop />
            <div className="span-wrapper">
                <header
                    style={{
                        height: '500px',
                        backgroundColor: '#ebebeb',
                    }}
                >
                    <Map
                        key={title}
                        noCircle={true}
                        hideRoads={true}
                        radius={4000000}
                        value={{
                            lat: 40.755983,
                            lng: -40.212879,
                        }}
                        height={500}
                        editable={false}
                        themeColor={themeColor}
                        locationName="playingLocation"
                    />
                    <article>
                        <div className="container fix-top-mobile">
                            <div className="col-md-5 col-sm-6">
                                <div className="card">
                                    <h1 key="title">
                                        <b>Locations</b>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </article>
                </header>

                <div className="container">
                    <CountriesList countries={countries} />
                </div>

                <img id="city-illustration" src={citySvg} />
            </div>

            <Footer
                noSkew
                color={secondColor}
                firstTo={translate(appRoutes.becomeDj)}
                secondTo={translate(appRoutes.howItWorks)}
                firstLabel={translate('become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('are-you-a-dj', { location: title })}
                subTitle={translate('apply-to-become-dj-or-see-how-it-works')}
            />
        </div>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default Location;
