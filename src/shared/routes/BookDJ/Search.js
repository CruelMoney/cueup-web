import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-apollo';
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
import { CheckBoxRow } from 'components/CheckboxTable';
import Checkmark from 'assets/Checkmark';
import { CustomCTAButton } from './Components';
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
    position: relative;
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
        border-radius: 27px;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .powered-by-google {
        top: 0.7em !important;
        display: flex;
        right: 0.7em !important;
    }
`;

const InsidePopup = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 20px;
    box-shadow: none;
    background: #fff;
    border: 1px solid #e9ecf0;
    border-radius: 27px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    z-index: 1;
    button.withIcon span {
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
    }
`;

const FilterPill = styled.button`
    padding: 0.5em 1em;
    background: #ffffff;
    border: 0.5px solid rgba(77, 100, 128, 0.2);
    border-radius: 20px;
    color: #4d6480;
    font-size: 14px;
    font-weight: 500;
    margin-right: 6px !important;
    margin-top: 6px !important;
    margin-left: 0px !important;

    ${({ active }) =>
        active &&
        css`
            box-shadow: inset 0 0 0px 2px #4d6480;
        `}
`;

const FilterPills = ({ form, setValue }) => {
    const [showEventTypes, setShowEventTypes] = useState(false);
    const [showBudget, setShowBudget] = useState(false);
    const [showEquipment, setShowEquipment] = useState(false);

    return (
        <>
            <RowWrap style={{ marginBottom: 30, marginTop: 20 }}>
                <FilterPill
                    onClick={() => setValue({ speakers: !form.speakers })}
                    active={!!form.genres}
                >
                    Music genres
                </FilterPill>
                <FilterPill
                    onClick={() => setShowEquipment(true)}
                    active={form.equipment && Object.values(form.equipment).filter(Boolean).length}
                >
                    Equipment
                </FilterPill>

                <FilterPill active={form.budget} onClick={() => setShowBudget(true)}>
                    {form.budget?.label || 'Budget'}
                </FilterPill>
                <FilterPill
                    active={
                        form.eventTypes && Object.values(form.eventTypes).filter(Boolean).length
                    }
                    onClick={() => setShowEventTypes(true)}
                >
                    Type of event
                </FilterPill>
            </RowWrap>
            {showEventTypes && (
                <EventTypeSelector
                    initialvalues={form.eventTypes}
                    onSave={(eventTypes) => {
                        setValue({ eventTypes });
                        setShowEventTypes(false);
                    }}
                />
            )}

            {showBudget && (
                <BudgetSelector
                    initialvalue={form.budget}
                    onSave={(budget) => {
                        setValue({ budget });
                        setShowBudget(false);
                    }}
                />
            )}

            {showEquipment && (
                <EquipmentSelector
                    initialvalue={form.equipment}
                    onSave={(equipment) => {
                        setValue({ equipment });
                        setShowEquipment(false);
                    }}
                />
            )}
        </>
    );
};

const EventTypeSelector = ({ initialvalues, onSave, loading }) => {
    const { form, setValue, clearForm } = useForm(null, initialvalues);
    const [key, setKey] = useState(0);

    const handleSave = () => {
        onSave(form);
    };

    return (
        <InsidePopup>
            <Col key={key} style={{ height: '100%' }}>
                <RowWrap>
                    <label>EVENT TYPE</label>
                </RowWrap>
                <CheckBoxRow
                    label="Wedding"
                    checked={form.wedding}
                    onChange={(wedding) => setValue({ wedding })}
                />
                <CheckBoxRow
                    label="Birthday"
                    checked={form.birthday}
                    onChange={(birthday) => setValue({ birthday })}
                />
                <CheckBoxRow
                    label="Corporate event"
                    checked={form.corporate}
                    onChange={(corporate) => setValue({ corporate })}
                />
                <CheckBoxRow
                    label="Club"
                    checked={form.club}
                    onChange={(club) => setValue({ club })}
                />
                <CheckBoxRow
                    label="Festival"
                    checked={form.festival}
                    onChange={(festival) => setValue({ festival })}
                />
                <CheckBoxRow
                    label="School"
                    checked={form.school}
                    onChange={(school) => setValue({ school })}
                />
                <CheckBoxRow
                    label="Outdoor"
                    checked={form.outdoor}
                    onChange={(outdoor) => setValue({ outdoor })}
                />
                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            clearForm();
                            setKey((k) => k + 1);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};

const BudgetButton = ({ value, label, setBudget, budget }) => (
    <SmartButton
        fullWidth
        level="secondary"
        className="withIcon"
        style={{ marginBottom: 6 }}
        onClick={() => setBudget({ value, label })}
    >
        {label}{' '}
        {budget?.value === value && (
            <Checkmark
                style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    backgroundColor: '#fff',
                    padding: 6,
                }}
                color={'#25F4D2'}
            />
        )}
    </SmartButton>
);

const BudgetSelector = ({ initialvalue, onSave, loading }) => {
    const [budget, setBudget] = useState(initialvalue);

    const handleSave = () => {
        onSave(budget);
    };

    return (
        <InsidePopup>
            <Col style={{ height: '100%' }}>
                <RowWrap>
                    <label>BUDGET</label>
                </RowWrap>

                <BudgetButton
                    value={250}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 250 USD'}
                />
                <BudgetButton
                    value={500}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 500 USD'}
                />
                <BudgetButton
                    value={750}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 750 USD'}
                />
                <BudgetButton
                    value={1000}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 1.000 USD'}
                />
                <BudgetButton
                    value={1500}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 1.500 USD'}
                />
                <BudgetButton
                    value={2000}
                    setBudget={setBudget}
                    budget={budget}
                    label={'More than 1.500 USD'}
                />

                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            setBudget(null);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};

const EquipmentSelector = ({ initialvalues, onSave, loading }) => {
    const { form, setValue, clearForm } = useForm(null, initialvalues);
    const [key, setKey] = useState(0);

    const handleSave = () => {
        onSave(form);
    };

    return (
        <InsidePopup>
            <Col key={key} style={{ height: '100%' }}>
                <RowWrap>
                    <label>EQUIPMENT</label>
                </RowWrap>
                <CheckBoxRow
                    label="Sound system"
                    checked={form.speakers}
                    onChange={(speakers) => setValue({ speakers })}
                />
                <CheckBoxRow
                    label="Lights"
                    checked={form.lights}
                    onChange={(lights) => setValue({ lights })}
                />
                <CheckBoxRow
                    label="Microphone"
                    checked={form.microphone}
                    onChange={(microphone) => setValue({ microphone })}
                />
                <CheckBoxRow
                    label="Smoke machine"
                    checked={form.smokeMachine}
                    onChange={(smokeMachine) => setValue({ smokeMachine })}
                />

                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            clearForm();
                            setKey((k) => k + 1);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};

const Filters = () => {
    const { translate } = useTranslate();

    const { runValidations, form, setValue } = useForm(null, {
        // locationName: activeLocation.name,
    });

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
                        borderRadius: '27px',
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
                style={{ height: '50px' }}
                noMargin
                noIcon
                type="submit"
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
