import React from 'react';
import { Helmet } from 'react-helmet-async';
import useTranslate from 'components/hooks/useTranslate';
import { useServerContext } from 'components/hooks/useServerContext';

import { appRoutes } from 'constants/locales/appRoutes';
import { Container, Col, CardSimple, Hr } from 'components/Blocks';
import Menu from 'components/Navigation';
import { BodySmall, PageTitle } from 'components/Text';
import Footer from '../../components/common/Footer';

import Map from '../../components/common/Map';
import citySvg from '../../assets/City.svg';
import { TopLocationsGrid } from './Components';

const CountriesOverview = () => {
    const themeColor = '#31DAFF';
    const secondColor = '#25F4D2';
    const { translate } = useTranslate();
    const title = 'DJs all over the world';
    const description = 'Find DJs in any of these countries.';

    const { data } = useServerContext();

    return (
        <>
            <Helmet>
                <title>{title + ' | Cueup'}</title>
                <meta name="description" content={description} />

                <meta property="og:title" content={title + ' | Cueup'} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={description} />

                <meta name="twitter:title" content={title + ' | Cueup'} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <Menu relative dark withSearch />
            <Hr style={{ marginBottom: 60 }} />

            <Container>
                <PageTitle>Countries</PageTitle>

                <TopLocationsGrid>
                    {data.countries.map(({ id, country, countrySlug }, idx) => (
                        <li key={id}>
                            <a href={translate(appRoutes.bookDj).replace(':location', countrySlug)}>
                                <BodySmall>{country}</BodySmall>
                            </a>
                        </li>
                    ))}
                </TopLocationsGrid>
            </Container>

            <img
                id="city-illustration"
                src={citySvg}
                style={{
                    width: '100%',
                    minWidth: 1000,
                    marginBottom: -10,
                    marginTop: 60,
                    left: '50%',
                    position: 'relative',
                    transform: 'translateX(-50%)',
                }}
            />

            <Footer
                noSkew
                color={secondColor}
                firstTo={translate(appRoutes.becomeDj)}
                secondTo={translate(appRoutes.home)}
                firstLabel={translate('become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('are-you-a-dj', { location: title })}
                subTitle={translate('apply-to-become-dj-or-see-how-it-works')}
            />
        </>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default CountriesOverview;
