import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import SmartNavigation from 'components/Navigation';
import { Container, Row, RowWrap, SmartButton } from 'components/Blocks';
import { Body, BodyBold, BodySmall, H2, H3, HeaderTitle, PageTitle } from 'components/Text';
import { GracefullPicture } from 'components/GracefullImage';
import Footer from 'components/common/Footer';
import LazyRequestForm from 'components/common/RequestForm';
import FeaturedDJCard from 'components/FeaturedDJCard';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Input, InputRow, Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import defaultImage from '../../assets/images/default.png';
import Map from '../../components/common/Map';
import BookDJForm from './BookDJForm';
import {
    BreadCrumbs,
    CustomCTAButton,
    CustomSection,
    HeroCard,
    HeroImageWrapper,
    HeroSection,
    ImageWrapper,
    MapWrapper,
} from './Components';

import heroImg from './assets/hero_1.webp';
import heroImgJPG from './assets/hero_1_compressed.jpg';
import { SEARCH } from './gql';

const Search = ({ translate, environment }) => {
    const onClickElement = (e) => {
        e.preventDefault();
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    // const breadCrumbs = [
    //     {
    //         url: '/',
    //         label: 'DJs',
    //     },
    //     {
    //         url: translate(appRoutes.bookDj).replace(':location', activeLocation.countrySlug),
    //         label: activeLocation.country,
    //     },
    // ];
    // if (activeLocation.citySlug) {
    //     breadCrumbs.push({
    //         url: translate(appRoutes.bookDj).replace(':location', activeLocation.citySlug),
    //         label: activeLocation.name,
    //     });
    // }

    return (
        <>
            <Helmet>
                {/* <title>{siteTitle}</title>
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
                <meta name="geo.region" content={title} /> */}
            </Helmet>
            <SmartNavigation dark relative fullWidth />
            <Container fullWidth>
                <LeftSide />
            </Container>
            {/* <Hero
                activeLocation={activeLocation}
                siteDescription={siteDescription}
                checkAvailability={checkAvailability}
            /> */}

            {/* <BreadCrumbs items={breadCrumbs} /> */}
            <Footer
                color={'#31DAFF'}
                fullWidth
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

const LeftSideWrapper = styled.div`
    max-width: 415px;
    width: 100%;
    top: 0;
    position: sticky;
    margin-bottom: 30px;
`;

const GreyBox = styled.section`
    background-color: #f7f9fc;
    border-radius: 27px;
    width: 100%;
    padding: 20px;
    margin-bottom: 15px;
    label,
    ${Label} {
        flex: 1;
        min-width: 0;
        color: #32325d;
        font-weight: 600;
        letter-spacing: 0.08em;
        font-size: 10px;
        margin-top: 0px;
        margin-right: 9px;
        margin-bottom: 12px;
        > span {
            margin-left: 9px;
        }
        > input,
        > button {
            font-size: 1.6em;
            background-color: white;
            padding-left: 0px;
            margin-top: 4px;
            height: 40px;
            text-align: left;
            justify-content: flex-start;
        }
    }

    ${RowWrap} {
        margin-right: -9px;
    }
`;

const Filters = () => {
    return (
        <GreyBox>
            <RowWrap>
                <LocationSelector
                    data-cy={'location-input'}
                    name="query"
                    label={'LOCATION'}
                    placeholder={"Where's the event?"}
                    wrapperStyle={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        position: 'initial',
                        marginBottom: 0,
                    }}
                    //    onSave={(locationName) => setValue({ locationName })}
                    //    defaultValue={form.locationName}
                />
            </RowWrap>
            <RowWrap>
                <DatePickerPopup
                    half
                    showInside
                    data-cy={'date-input'}
                    label="WHEN"
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    // onSave={(date) => {
                    //     setValue({ date });
                    // }}
                />
                <Input
                    half
                    label="GUESTS"
                    placeholder="Add guest count"
                    // value={form.guestsCount}
                    // onChange={(guests) => {
                    //     setValue({ guestsCount: guests.replace(/\D/g, '') });
                    // }}
                />
            </RowWrap>

            <RowWrap>
                <Input
                    // className={form.speakers ? '' : 'empty'}
                    label="SOUND SYSTEM"
                    type="button"
                    //     buttonText={form.speakers ? 'Yes' : 'Add sound system'}
                    //     onClick={() => setValue({ speakers: !form.speakers })}
                />
                <span className="divider" />
                <Input
                    // className={form.lights ? '' : 'empty'}
                    label="LIGHTS"
                    type="button"
                    // buttonText={form.lights ? 'Yes' : 'Add lights'}
                    // onClick={() => setValue({ lights: !form.lights })}
                />
            </RowWrap>
            <CustomCTAButton
                style={{ height: '50px' }}
                noMargin
                noIcon
                // type="submit"
                // loading={loading}
                // onClick={submit}
            >
                Find DJs
            </CustomCTAButton>
        </GreyBox>
    );
};

const RequestOffers = () => {
    return (
        <GreyBox>
            <BodyBold>Tired of searching?</BodyBold>
            <BodySmall style={{ marginBottom: 15 }}>
                Get tailored prices directly from the DJs. We’ll find the most suitable DJs and
                inquire them to send their best offers for your event.
            </BodySmall>
            <SmartButton
                level="secondary"
                fullWidth
                style={{
                    height: '50px',
                    backgroundColor: '#fff',
                    borderRadius: 13,
                    border: '0.5px solid rgba(77, 100, 128, 0.2)',
                }}
            >
                Request offers
            </SmartButton>
        </GreyBox>
    ); /* Rectangle 10 */
};

const LeftSide = () => {
    return (
        <LeftSideWrapper>
            <Filters />
            <RequestOffers />
        </LeftSideWrapper>
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

    // if (!activeLocation) {
    //     return <Redirect to={translate(appRoutes.notFound)} />;
    // }

    return (
        <Search
            {...props}
            translate={translate}
            activeLocation={activeLocation}
            environment={environment}
            topDjs={topDjs}
        />
    );
};

export default DataWrapper;
