import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Redirect, Route, Switch, useLocation, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useLazyQuery, useQuery } from '@apollo/client';
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
import { Input, InputLabel, Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';

import TimeSlider from 'components/common/TimeSlider/TimeSlider';
import { useForm } from 'components/hooks/useForm';

import { useCheckDjAvailability } from 'actions/EventActions';
import { ScrollToTopOnMount } from 'components/common/ScrollToTop';
import useUrlState from 'components/hooks/useUrlState';
import { CustomCTAButton, GreyBox } from './Components';
import { SEARCH_DEEP } from './gql';
import SearchResults from './SearchResults';
import { FilterPills } from './Filters';
import { RequestOffers } from './RequestOffers';

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
            <ScrollToTopOnMount />
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

const Filters = ({ form, setValue, doSearch, loading }) => {
    const { translate } = useTranslate();

    return (
        <GreyBox style={{ minHeight: 450 }}>
            <RowWrap>
                <LocationSelector
                    v2
                    data-cy={'location-input'}
                    name="query"
                    label={'LOCATION'}
                    placeholder={"Where's the event?"}
                    wrapperStyle={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        position: 'initial',
                        marginBottom: 20,
                    }}
                    onSave={(locationName) => setValue({ locationName })}
                    defaultValue={form.locationName}
                />
            </RowWrap>
            <RowWrap>
                <DatePickerPopup
                    half
                    v2
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
                    v2
                    label="GUESTS"
                    placeholder="Add guest count"
                    value={form.guestsCount}
                    onChange={(guests) => {
                        setValue({ guestsCount: guests.replace(/\D/g, '') });
                    }}
                />
            </RowWrap>

            <InputLabel v2 style={{ flex: 0, marginBottom: 8 }}>
                <span>DURATION</span>
            </InputLabel>
            <TimeSlider
                v2
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
                disabled={loading}
                onClick={doSearch}
            >
                Find DJs
            </CustomCTAButton>
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
    const mounted = useRef(false);
    const { search, state: navState } = useLocation();

    const searchParams = new URLSearchParams(search);
    const initialPage = Number(searchParams.get('page')) || 1;
    const [pagination, setPagination] = useState({
        page: initialPage,
    });

    const { environment, data } = useServerContext();
    const fallBackLocation = data?.topCities[0]?.country;

    const [form, setForm] = useUrlState({
        countryCode: data?.topCities[0]?.iso2,
        location: navState?.location,
        locationName: navState?.location?.name || fallBackLocation,
        ...navState,
    });
    const setValue = useCallback(
        (val) => {
            setForm((ff) => ({ ...ff, ...val }));
        },
        [setForm]
    );

    const { data: searchData, loading, refetch } = useQuery(SEARCH_DEEP, {
        fetchPolicy: 'cache-first',
        skip: !form.location && !form.countryCode,
        variables: {
            filter: formToFilter(form),
            pagination: {
                orderBy: 'UPDATED_AT_DESCENDING',
                limit: 9,
                page: pagination.page,
            },
        },
    });

    const [check, { loading: loading2 }] = useCheckDjAvailability();

    const checkAvailable = useCallback(async () => {
        if (form.locationName && mounted.current) {
            const { result, location } = await check({
                locationName: form.locationName,
                date: form.date,
            });
            if (result === true) {
                setValue({ location });
            } else {
                // handle no djs available
                return null;
            }
        }
    }, [form.locationName, form.date, check, setValue]);

    useEffect(() => {
        checkAvailable();
        mounted.current = true;
    }, [checkAvailable, form.locationName, form.date]);

    useEffect(() => {
        setPagination({ page: 1 });
    }, [form]);

    const { edges, pageInfo } = searchData?.searchDjs || {};

    let topDjs = edges || [];
    if (loading || loading2) {
        topDjs = [null, null, null, null, null, null, null, null, null];
    }

    return (
        <Search
            {...props}
            translate={translate}
            environment={environment}
            topDjs={topDjs}
            form={form}
            setValue={setValue}
            doSearch={checkAvailable}
            loading={loading || loading2}
            pagination={{
                ...pageInfo,
                ...pagination,
            }}
            setPagination={setPagination}
        />
    );
};

const formToFilter = ({ countryCode, location, genres }) => ({
    countryCode,
    location,
    genres,
});

export default DataWrapper;
