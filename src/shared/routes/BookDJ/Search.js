import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import SmartNavigation from 'components/Navigation';
import { Container, HideBelow, RowWrap } from 'components/Blocks';
import Footer from 'components/common/Footer';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Input, InputLabel } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';

import TimeSlider from 'components/common/TimeSlider/TimeSlider';
import { useForm } from 'components/hooks/useForm';

import { useCheckDjAvailability } from 'actions/EventActions';
import { ScrollToTopOnMount } from 'components/common/ScrollToTop';
import useUrlState from 'components/hooks/useUrlState';
import { ME } from 'components/gql';
import { CustomCTAButton, GreyBox } from './Components';
import { SEARCH_DEEP } from './gql';
import SearchResults from './SearchResults';
import { FilterPills } from './Filters';
import { RequestOffers } from './RequestOffers';

const Search = (props) => {
    const { translate, form } = props;
    const { location, locationName } = form;
    const onClickElement = (e) => {
        e.preventDefault();
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const siteTitle = locationName + ' · DJs · Cueup';
    const siteDescription =
        'Hire the best DJs on Cueup - the top booking website trusted by 1000s of event organizers.';

    return (
        <>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={siteDescription} />

                <meta property="og:title" content={siteTitle} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={siteDescription} />

                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />

                {location && (
                    <meta
                        name="geo.position"
                        content={`${location.latitude}; ${location.longitude}`}
                    />
                )}
                <meta name="geo.placename" content={locationName} />
            </Helmet>
            <ScrollToTopOnMount />
            <SmartNavigation dark relative />
            <Container>
                <SearchLayout>
                    <LeftSide {...props} />
                    <SearchResults {...props} />
                </SearchLayout>
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
    @media only screen and (max-width: 768px) {
        position: relative;
        max-width: 100%;
        min-width: 100%;
    }
`;

const SearchLayout = styled.div`
    display: flex;
    position: relative;
    align-items: flex-start;
    @media only screen and (max-width: 768px) {
        flex-direction: column;
    }
`;

const Filters = ({
    form,
    setValue,
    doSearch,
    loading,
    registerValidation,
    unregisterValidation,
}) => {
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
                        flexDirection: 'column',
                        position: 'initial',
                        marginBottom: 20,
                    }}
                    onSave={(locationName) => setValue({ locationName })}
                    defaultValue={form.locationName}
                    validation={(v) => (v ? null : 'Please select a location')}
                    registerValidation={registerValidation('locationName')}
                    unregisterValidation={unregisterValidation('locationName')}
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
                        const guestsCount = guests.replace(/\D/g, '');
                        setValue({
                            guestsCount: guestsCount ? parseInt(guestsCount, 10) : guestsCount,
                        });
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
            <HideBelow>
                <RequestOffers {...props} />
            </HideBelow>
        </LeftSideWrapper>
    );
};

const DataWrapper = (props) => {
    const searchRef = useRef();
    const { translate } = useTranslate();
    const mounted = useRef(false);
    const { search, state: navState } = useLocation();

    const searchParams = new URLSearchParams(search);
    const initialPage = Number(searchParams.get('page')) || 1;
    const [pagination, setPagination] = useState({
        page: initialPage,
    });
    const { data: userData } = useQuery(ME);

    const { environment, data } = useServerContext();
    const fallBackLocation = data?.topCities[0]?.country;

    const [form, setForm] = useUrlState({
        countryCode: data?.topCities[0]?.iso2,
        location: navState?.location,
        startMinute: 18 * 60,
        endMinute: 24 * 60,
        locationName: navState?.location?.name || fallBackLocation,
        contactName: userData?.me?.userMetadata.fullName,
        contactEmail: userData?.me?.email,
        contactPhone: userData?.me?.userMetadata.phone,
        ...navState,
    });
    const setValue = useCallback(
        (val) => {
            setForm((ff) => ({ ...ff, ...val }));
        },
        [setForm]
    );
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const scrollToSearchResults = useCallback(() => {
        let top = 0;
        if (searchRef.current) {
            const bodyRectTop = document.body.getBoundingClientRect().top;
            const searchTop = searchRef.current.getBoundingClientRect().top;
            top = searchTop - bodyRectTop - 20;
        }
        if (mounted.current) {
            setTimeout(() => {
                window.scrollTo({
                    top,
                    left: 0,
                    behavior: 'smooth',
                });
            }, 100);
        }
    }, []);

    const { data: searchData, loading } = useQuery(SEARCH_DEEP, {
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

    const checkAvailable = useCallback(
        async (doScroll) => {
            if (form.locationName && mounted.current) {
                if (doScroll) {
                    scrollToSearchResults();
                }
                const { location } = await check({
                    locationName: form.locationName,
                    date: form.date,
                });
                setValue({ location });
            }
        },
        [form.locationName, form.date, check, setValue, scrollToSearchResults]
    );
    useEffect(() => {
        scrollToSearchResults();
    }, [pagination, scrollToSearchResults]);

    useEffect(() => {
        checkAvailable();
    }, [checkAvailable, form.locationName, form.date]);

    useEffect(() => {
        if (mounted.current) {
            setPagination({ page: 1 });
        }
    }, [form.locationName, form.genres]);

    useEffect(() => {
        mounted.current = true;
    }, []);

    const { edges, pageInfo } = searchData?.searchDjs || {};

    let topDjs = edges || [];
    if (loading || loading2) {
        topDjs = [null, null, null, null, null, null, null, null, null];
    }

    // if (!topDjs.length) {
    //     return <Redirect to={'/book-dj' + search} />;
    // }

    return (
        <Search
            {...props}
            translate={translate}
            environment={environment}
            topDjs={topDjs}
            form={form}
            setValue={setValue}
            doSearch={() => checkAvailable(true)}
            loading={loading || loading2}
            pagination={{
                ...pageInfo,
                ...pagination,
            }}
            registerValidation={registerValidation}
            unregisterValidation={unregisterValidation}
            runValidations={runValidations}
            setPagination={setPagination}
            searchRef={searchRef}
        />
    );
};

const formToFilter = ({ countryCode, location, genres }) => ({
    countryCode,
    location,
    genres,
});

export default DataWrapper;
