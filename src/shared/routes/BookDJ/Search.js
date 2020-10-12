import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useLazyQuery, useQuery } from 'react-apollo';
import styled, { css } from 'styled-components';
import { InlineIcon } from '@iconify/react';
import speechIcon from '@iconify/icons-ion/ios-text';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import SmartNavigation from 'components/Navigation';
import { Col, Container, Row, RowWrap, SmartButton } from 'components/Blocks';
import { BodyBold, BodySmall } from 'components/Text';
import Footer from 'components/common/Footer';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Input, Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';

import TimeSlider from 'components/common/TimeSlider/TimeSlider';
import { useForm } from 'components/hooks/useForm';

import { useCheckDjAvailability } from 'actions/EventActions';
import { CustomCTAButton } from './Components';
import { SEARCH_DEEP } from './gql';
import SearchResults from './SearchResults';
import { FilterPills } from './Filters';

const Search = (props) => {
    const { translate } = props;

    const onClickElement = (e) => {
        e.preventDefault();
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

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
            <SmartNavigation dark relative />
            <Container>
                <Row>
                    <LeftSide {...props} />
                    <SearchResults {...props} />
                </Row>
            </Container>

            <Footer
                color={'#31DAFF'}
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
    min-width: 415px;
    width: 100%;
    top: 15px;
    position: sticky;
    margin-bottom: 15px;
    margin-right: 30px;
`;

const GreyBox = styled.section`
    background-color: #f7f9fc;
    border-radius: 12px;
    width: 100%;
    padding: 20px;
    margin-bottom: 15px;
    position: relative;
    display: flex;
    flex-direction: column;
    > label {
        color: #32325d;
        font-weight: 600;
        letter-spacing: 0.08em;
        font-size: 10px;
    }
    ${RowWrap} {
        margin-right: -9px;
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
    }
    .time-slider-data {
        padding: 0 9px;
        margin-top: 6px !important;
        margin-bottom: 17px !important;
        p {
            font-size: 16px;
        }
    }
    .empty {
        color: #98a4b3;
    }
    ul {
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        padding: 7px;
        padding-top: 5em;
        box-shadow: none;
        border: 1px solid #e9ecf0;
        border-radius: 12px;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .powered-by-google {
        top: 1em !important;
        display: flex;
        right: 1em !important;
    }
`;

const Filters = ({ form, setValue, doSearch, loading }) => {
    const { translate } = useTranslate();

    return (
        <GreyBox style={{ minHeight: 450 }}>
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
                    onSave={(locationName) => setValue({ locationName })}
                    defaultValue={form.locationName}
                />
            </RowWrap>
            <RowWrap>
                <DatePickerPopup
                    half
                    showInside
                    data-cy={'date-input'}
                    label="WHEN"
                    insideStyle={{
                        transform: 'none',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        border: '1px solid #e9ecf0',
                        borderRadius: '12px',
                    }}
                    initialDate={form.date}
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    onSave={(date) => {
                        setValue({ date });
                    }}
                />
                <Input
                    half
                    label="GUESTS"
                    placeholder="Add guest count"
                    value={form.guestsCount}
                    onChange={(guests) => {
                        setValue({ guestsCount: guests.replace(/\D/g, '') });
                    }}
                />
            </RowWrap>

            <label
                className="input-label-small"
                style={{ marginBottom: 8, marginLeft: 9, display: 'block' }}
            >
                DURATION
            </label>
            <TimeSlider
                hoursLabel={translate('hours')}
                startLabel={translate('start')}
                endLabel={translate('end')}
                date={form.date}
                initialValues={form.startMinute && [form.startMinute, form.endMinute]}
                onChange={([startMinute, endMinute]) => {
                    setValue({ startMinute });
                    setValue({ endMinute });
                }}
            />

            <FilterPills form={form} setValue={setValue} />

            <CustomCTAButton
                style={{ height: '50px', marginTop: 'auto' }}
                noMargin
                noIcon={!loading}
                type="submit"
                loading={loading}
                onClick={doSearch}
            >
                Find DJs
            </CustomCTAButton>
        </GreyBox>
    );
};

const RequestOffers = () => {
    return (
        <GreyBox>
            <BodyBold>
                <InlineIcon
                    icon={speechIcon}
                    color="#25F4D2"
                    width={'1.5em'}
                    height={'1.5em'}
                    style={{ marginRight: 9, marginBottom: -6 }}
                />
                Tired of searching?
            </BodyBold>
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
    );
};

const LeftSide = (props) => {
    return (
        <LeftSideWrapper>
            <Filters {...props} />
            <RequestOffers {...props} />
        </LeftSideWrapper>
    );
};

const DataWrapper = (props) => {
    const { translate } = useTranslate();
    const [pagination, setPagination] = useState({
        orderBy: 'UPDATED_AT_DESCENDING',
        page: 1,
        limit: 9,
    });
    const { environment, data } = useServerContext();

    const [filter, setFilter] = useState({
        countryCode: data?.topCities[0]?.iso2,
    });

    const fallBackLocation = data?.topCities[0]?.country;

    const { runValidations, form, setValue } = useForm(null, {
        locationName: fallBackLocation,
    });

    const { data: searchData, loading } = useQuery(SEARCH_DEEP, {
        fetchPolicy: 'cache-first',
        skip: !filter.location && !filter.countryCode,
        variables: {
            filter,
            pagination,
        },
    });

    const [check, { loading: loading2 }] = useCheckDjAvailability();

    const doSearch = useCallback(async () => {
        const errors = runValidations();

        if (errors.length === 0) {
            const { result, date, timeZoneId, location } = await check({
                locationName: form.locationName,
                date: form.date,
            });

            if (result === true) {
                const newFilter = {
                    location,
                };

                setFilter(newFilter);
            }
        }
    }, [form, check, runValidations]);

    const { edges: topDjs = [], pageInfo } = searchData?.searchDjs || {};

    // if (!activeLocation) {
    //     return <Redirect to={translate(appRoutes.notFound)} />;
    // }

    return (
        <Search
            {...props}
            translate={translate}
            environment={environment}
            topDjs={topDjs}
            form={form}
            setValue={setValue}
            doSearch={doSearch}
            loading={loading || loading2}
            pageInfo={pageInfo}
            setPagination={setPagination}
        />
    );
};

export default DataWrapper;
