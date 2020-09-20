import React from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import defaultImage from '../../assets/images/cities/default.png';
import BookDJForm from './BookDJForm';
import { HeroCard } from './Components';

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

            <Hero activeLocation={activeLocation} />
        </>
    );
};

const Hero = ({ activeLocation }) => {
    return (
        <section>
            <HeroCard>
                <h1>
                    Book a DJ in <span>{activeLocation.name}</span>
                </h1>
                <BookDJForm />
            </HeroCard>
        </section>
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

export default DataWrapper;
