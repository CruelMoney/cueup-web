import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import wNumb from 'wnumb';
import * as Sentry from '@sentry/react';
import { InlineIcon } from '@iconify/react';
import arrowBack from '@iconify/icons-ion/arrow-back';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useLocation, useRouteMatch } from 'react-router';
import { useCreateEvent } from 'actions/EventActions';
import { useForm } from 'components/hooks/useForm';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { CTAButton } from 'components/CTAButton';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import useUrlState from 'components/hooks/useUrlState';
import { ME } from 'components/gql';

import Step4 from 'components/common/RequestForm/Step4';
import { hideChatButton, showChatButton } from 'utils/supportChat';
import { useAppState } from 'components/hooks/useAppState';
import Logo from 'components/common/Logo';
import AddBookingLink from 'components/AddBookingLink';
import useTranslate from 'components/hooks/useTranslate';
import { SettingsSection, Input, Label } from '../../../components/FormComponents';
import DatePickerPopup from '../../../components/DatePickerPopup';
import {
    Row,
    Container,
    Col,
    PrimaryButton,
    TeritaryButton,
    Card,
    Avatar,
    Hr,
} from '../../../components/Blocks';
import ScrollToTop from '../../../components/common/ScrollToTop';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import { TitleClean, Body, Title, BodySmall } from '../../../components/Text';
import RiderOptions from '../../../components/RiderOptions';
import TimeSlider from '../../../components/common/TimeSlider';
import Slider from '../../../components/common/Slider';
import Popup from '../../../components/common/Popup';
import Login from '../../../components/common/Login';
import ErrorMessageApollo from '../../../components/common/ErrorMessageApollo';
import GeoCoder from '../../../utils/GeoCoder';
import { MobileBookingButton } from '../components/Common';

const Booking = ({ user, loading }) => {
    const { translate, currentLanguage } = useTranslate();
    const location = useLocation();
    const { path } = useRouteMatch();
    const { setAppState } = useAppState();
    const [eventCreated, setEventCreated] = useState(false);
    const { data: userData } = useQuery(ME);
    const [create, { error }] = useCreateEvent();
    const [errorMessage, setError] = useState();
    const [loginPopup, setloginPopup] = useState(false);
    const [signupPopup, setSignupPopup] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const isDirect = path === translate(appRoutes.userBookDirect);

    useEffect(() => {
        hideChatButton();
        setAppState({ showBottomPlayer: false });
        return () => {
            showChatButton();
            setAppState({ showBottomPlayer: true });
        };
    }, [setAppState]);

    const [form, setForm] = useUrlState({
        guestsCount: 80,
        startMinute: 21 * 60,
        endMinute: 27 * 60,
        contactName: userData?.me?.userMetadata.fullName,
        contactEmail: userData?.me?.email,
        contactPhone: userData?.me?.userMetadata.phone,
        isFromPrivateLink: isDirect,
    });

    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const setValue = (data) => setForm((f) => ({ ...f, ...data }));

    const requestBooking = async () => {
        const refs = runValidations(true);

        if (refs.length) {
            return;
        }

        if (!userData?.me && !signupPopup) {
            setSignupPopup(true);
            return;
        }

        try {
            setCreateLoading(true);

            setSignupPopup(false);

            const variables = {
                // fallback to user location
                locationName: user.playingLocation.name,
                // fallback to user genres
                genres: user.genres,
                ...form,
                djId: user.id,
            };

            if (!variables.location) {
                try {
                    const { lat, lng } = await GeoCoder.codeAddress(variables.locationName);
                    variables.location = {
                        latitude: lat,
                        longitude: lng,
                        name: variables.locationName,
                    };
                } catch (error) {
                    // fallback to user location
                    variables.location = {
                        ...user.playingLocation,
                    };
                }
            }

            if (!variables.timeZone) {
                const { timeZoneId } = await GeoCoder.getTimeZone({
                    lat: variables.location.latitude,
                    lng: variables.location.longitude,
                });
                variables.timeZone = timeZoneId;
            }

            const result = await create(variables);

            const { data } = result;
            setEventCreated(data?.createEvent);
        } catch (error) {
            setError(error);
            Sentry.captureException(error);
        } finally {
            setCreateLoading(false);
        }
    };

    const profileUrl = `${translate(appRoutes.user)}/${user.permalink}/${userRoutes.overview}${
        location.search
    }`;

    const metaTitle = `Book ${user.title} · Cueup`;
    const metaDescription = `Complete your booking of ${user.title}.`;

    return (
        <div>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />

                <meta name="description" content={metaDescription} />
                <meta name="twitter:description" content={metaDescription} />
                <meta property="og:description" content={metaDescription} />
            </Helmet>
            <ScrollToTop top={0} />

            <Popup width="380px" showing={signupPopup} onClickOutside={() => setSignupPopup(false)}>
                <Step4
                    hideHeadline
                    form={form}
                    handleChange={setValue}
                    runValidations={runValidations}
                    registerValidation={registerValidation}
                    unregisterValidation={unregisterValidation}
                    next={requestBooking}
                    back={() => setSignupPopup(false)}
                    loading={createLoading}
                    user={userData?.me}
                    style={{
                        width: 'auto',
                    }}
                    buttonLabel={isDirect ? 'Book' : 'Contact'}
                />
            </Popup>

            <Popup width="380px" showing={loginPopup} onClickOutside={() => setloginPopup(false)}>
                <div>
                    <TitleClean center>Login</TitleClean>
                    <p style={{ marginBottom: '20px' }}>{translate('email-exists-message')}</p>
                    <Login
                        redirect={false}
                        onLogin={() => {
                            setloginPopup(false);
                        }}
                    />
                </div>
            </Popup>

            <Container
                style={{
                    paddingTop: 15,
                }}
            >
                {user.isOwn && !isDirect && (
                    <>
                        <AddBookingLink user={user} /> <Hr style={{ marginBottom: 30 }} />
                    </>
                )}

                <NavLink to={profileUrl}>
                    <TeritaryButton
                        style={{
                            marginLeft: -15,
                            marginBottom: -24,
                            maxWidth: 'initial',
                        }}
                    >
                        <Row middle>
                            <InlineIcon
                                icon={arrowBack}
                                style={{ marginRight: 6, fontSize: '1.2em' }}
                            />
                            <div style={{ marginRight: 6, zIndex: 2, position: 'relative' }}>
                                <Avatar src={user?.picture?.path} />
                            </div>
                            <BodySmall>{user.title}</BodySmall>
                        </Row>
                    </TeritaryButton>
                </NavLink>
                <EventForm
                    setValue={setValue}
                    registerValidation={registerValidation}
                    unregisterValidation={unregisterValidation}
                    form={form}
                    translate={translate}
                    user={user}
                    loading={loading}
                    requestBooking={requestBooking}
                    loginPopup={loginPopup}
                    eventCreated={eventCreated}
                    createLoading={createLoading}
                    error={error || errorMessage}
                    showLogin={() => setloginPopup(true)}
                    isDirect={isDirect}
                />

                <PoweredBy>
                    <Hr />
                    <a
                        className="logo-row"
                        href={'https://cueup.io'}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <BodySmall>Powered by</BodySmall>
                        <Logo height={16} width="auto" />
                    </a>
                </PoweredBy>
            </Container>
        </div>
    );
};

const EventFormWrapper = styled(Row)`
    .sidebar {
        margin-left: 60px;
        margin-top: 42px;
        @media only screen and (max-width: 768px) {
            margin-left: 30px;
            margin-top: 0px;
        }
    }
`;

const EventForm = ({
    setValue,
    registerValidation,
    unregisterValidation,
    form,
    translate,
    user,
    loading,
    loginPopup,
    eventCreated,
    isDirect,
    ...props
}) => (
    <EventFormWrapper>
        {eventCreated ? (
            <SuccessMessage translate={translate} userId={eventCreated?.organizer?.id} />
        ) : (
            <Col
                style={{
                    marginTop: '42px',
                    width: '100%',
                    zIndex: 0,
                    position: 'relative',
                    minHeight: 'calc(100vh - 160px)',
                }}
            >
                <SettingsSection
                    small
                    noBorder
                    sticky={false}
                    title={'Event Details'}
                    description={`Tell ${user.title} about your event.`}
                    style={{
                        flex: 1,
                    }}
                >
                    <Input
                        v2
                        half
                        style={{ marginRight: 0 }}
                        type="text"
                        name="eventName"
                        label="Event Name"
                        placeholder="Add a short, clear name"
                        onSave={(name) => setValue({ name })}
                        defaultValue={form.name}
                        validation={(v) => (v ? null : 'Please enter a name')}
                        registerValidation={registerValidation('name')}
                        unregisterValidation={unregisterValidation('name')}
                    />
                    <DatePickerPopup
                        half
                        v2
                        style={{ marginRight: 0 }}
                        label={'Date'}
                        minDate={new Date()}
                        initialDate={form.date ? moment(form.date) : null}
                        showMonthDropdown={false}
                        showYearDropdown={false}
                        maxDate={false}
                        onSave={(date) => setValue({ date })}
                    />

                    <Label
                        v2
                        style={{
                            minWidth: '100%',
                            paddingRight: '36px',
                            marginBottom: '30px',
                        }}
                    >
                        <span
                            style={{
                                marginBottom: '12px',
                                display: 'block',
                                marginLeft: 9,
                            }}
                        >
                            Duration
                        </span>
                        <TimeSlider
                            v2
                            color={'#50e3c2'}
                            hoursLabel={translate('hours')}
                            startLabel={translate('start')}
                            endLabel={translate('end')}
                            onChange={([startMinute, endMinute]) => {
                                setValue({ startMinute, endMinute });
                            }}
                        />
                    </Label>

                    <Label
                        v2
                        style={{
                            minWidth: '100%',
                            paddingRight: '36px',
                            marginBottom: '30px',
                        }}
                    >
                        <span
                            style={{
                                marginBottom: '12px',
                                display: 'block',
                                marginLeft: 9,
                            }}
                        >
                            Guests
                        </span>

                        <Slider
                            v2
                            color={'#50e3c2'}
                            name="guestsCount"
                            range={{
                                'min': 1,
                                '50%': 100,
                                '80%': 500,
                                'max': 1000,
                            }}
                            step={1}
                            connect="lower"
                            value={[form.guestsCount]}
                            onChange={(values) => {
                                setValue({ guestsCount: values[0] });
                            }}
                            format={wNumb({
                                decimals: 0,
                            })}
                        />
                        <BodySmall
                            style={{ marginTop: '15px', display: 'block', marginLeft: 9 }}
                        >{`${form.guestsCount} people`}</BodySmall>
                    </Label>

                    <div style={{ marginRight: '36px', marginBottom: '30px' }}>
                        <RiderOptions
                            initialValues={{
                                speakers: form.equipment?.speakers,
                                lights: form.equipment?.lights,
                                microphone: form.equipment?.microphone,
                            }}
                            onSave={({ speakers, lights, microphone }) => {
                                setValue({
                                    equipment: {
                                        ...form.equipment,
                                        speakers,
                                        lights,
                                        microphone,
                                    },
                                });
                            }}
                        />
                    </div>

                    <Input
                        v2
                        type="text-area"
                        label={'Message'}
                        name="description"
                        placeholder={translate('event-description-placeholder')}
                        style={{
                            height: '200px',
                        }}
                        defaultValue={form.description}
                        onSave={(description) => setValue({ description })}
                        validation={(v) => (v ? null : 'Please enter a description')}
                        registerValidation={registerValidation('description')}
                        unregisterValidation={unregisterValidation('description')}
                    />
                </SettingsSection>
            </Col>
        )}

        <BookingSidebar
            key={loginPopup}
            loading={loading}
            user={user}
            values={form}
            eventCreated={eventCreated}
            isDirect={isDirect}
            {...props}
        />
    </EventFormWrapper>
);

const BookingSidebar = ({
    loading,
    values,

    error,

    showLogin,
    isDirect,
    ...props
}) => {
    const { state } = useLocation();
    const { user, createLoading, requestBooking, eventCreated } = props;

    const { buttonLabel } = state || {};
    const { pricing } = user || {};

    const ctaAction = buttonLabel || (isDirect ? `Book  ${user.title}` : 'Check availability');
    const ctaLabel = eventCreated ? 'Done' : ctaAction;

    return (
        <>
            <SideBar>
                <Card style={{ minWidth: 300, maxWidth: 370, width: '100%' }}>
                    <div className="content">
                        {loading ? (
                            <LoadingPlaceholder2 />
                        ) : (
                            <Content values={values} ctaLabel={ctaLabel} {...props} />
                        )}
                    </div>
                </Card>
                <ErrorMessageApollo
                    error={error}
                    style={{ marginTop: '30px' }}
                    onFoundCode={(code) => {
                        if (code === 'UNAUTHENTICATED') {
                            showLogin();
                        }
                    }}
                />
            </SideBar>

            <MobileBookingButton>
                <Row middle>
                    <MobilePricing pricing={pricing} />
                    <CTAButton
                        type="submit"
                        disabled={createLoading || eventCreated}
                        loading={createLoading}
                        onClick={requestBooking}
                        noIcon
                        style={{ margin: 0, width: '100%' }}
                    >
                        {ctaLabel}
                    </CTAButton>
                </Row>
            </MobileBookingButton>
        </>
    );
};

const MobilePricing = ({ pricing }) => {
    if (!pricing) {
        return null;
    }

    const { hourlyRate } = pricing;
    const { amount, currency } = hourlyRate;

    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currency,
    });

    return (
        <Body style={{ width: '100%' }}>
            <b>{formatter.format(amount / 100)}</b>
            <span style={{ fontSize: '0.8em' }}> / hour</span>
        </Body>
    );
};

const SideBar = styled.div`
    position: sticky;
    top: 0px;
    margin-bottom: 42px;
    align-self: flex-start;
    z-index: 2;
    margin-left: 42px;
    ${Card} {
        box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.15);
        border-radius: 10px;
    }
    .content {
        padding: 1em;
        width: 100%;
    }
    @media only screen and (max-width: 664px) {
        display: none;
    }
`;

const SidebarRow = styled(Row)`
    font-weight: 600;
    font-size: 15px;
    color: #98a4b3;
    align-items: center;
    margin-bottom: 12px;
`;

const SimpleTableItem = styled(SidebarRow)`
    border-bottom: 1px solid #e2e8f0;
    padding: 15px 0;
    margin: 0;
    justify-content: space-between;
    &:first-child {
        border-top: 1px solid #e2e8f0;
        margin-top: 24px;
    }

    > *:first-child {
        color: #122b48;
    }
`;

const PoweredBy = styled.div`
    .logo-row {
        display: flex;
        height: 80px;
        align-items: center;
        position: relative;
        p {
            line-height: 1em;
        }
    }
    .logo {
        fill: #4d6480;
        margin-left: 4px;
        display: inline-block;
        margin-top: -1px;
    }
    @media only screen and (max-width: 664px) {
        margin-bottom: 80px;
        margin-top: -60px;
    }
`;

const Content = ({ user, values, createLoading, requestBooking, eventCreated, ctaLabel }) => {
    const { artistName, userMetadata, pricing } = user;
    const { firstName } = userMetadata;

    const { guestsCount, date, equipment, startMinute, endMinute, name } = values;

    const startMoment = moment(date).startOf('day').add(startMinute, 'minutes');
    const endMoment = moment(date).startOf('day').add(endMinute, 'minutes');

    const hours = endMoment.diff(startMoment, 'hours', true);

    return (
        <>
            <h1 style={{ marginBottom: '15px', fontSize: 16 }}>{`Your booking: ${
                artistName || firstName
            }`}</h1>
            {name && <SidebarRow>{name}</SidebarRow>}
            <SidebarRow>{moment(date).format('dddd Do MMMM, YYYY')}</SidebarRow>
            <SidebarRow>
                From {startMoment.format('HH:mm')} to{' '}
                {endMoment.add(endMinute, 'minutes').format('HH:mm')}
            </SidebarRow>
            <SidebarRow>{guestsCount} guests</SidebarRow>
            {equipment?.speakers && <SidebarRow>Including speakers</SidebarRow>}
            {equipment?.lights && <SidebarRow>Including party lights</SidebarRow>}
            {equipment?.microphone && <SidebarRow>Including microphone</SidebarRow>}
            <CTAButton
                style={{ width: '100%', margin: 0, marginTop: 24, height: 50 }}
                data-cy="book-button"
                disabled={createLoading || eventCreated}
                loading={createLoading}
                onClick={requestBooking}
                noIcon
            >
                {ctaLabel}
            </CTAButton>
            <BodySmall style={{ textAlign: 'center', marginTop: 12 }}>
                You won't be charged yet
            </BodySmall>
            <div>
                {pricing ? (
                    <HourlyPricingTable pricing={pricing} hours={hours} />
                ) : (
                    <SimpleTableItem style={{ borderBottom: 'none', paddingBottom: 0 }}>
                        <span>Total</span>
                        <span style={{ textAlign: 'right', marginLeft: 12 }}>
                            DJ responds with price
                        </span>
                    </SimpleTableItem>
                )}
            </div>
        </>
    );
};

const HourlyPricingTable = ({ pricing, hours }) => {
    const { hourlyRate } = pricing;
    const { amount, currency } = hourlyRate;

    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currency,
    });

    return (
        <>
            <SimpleTableItem style={{ fontWeight: 400, borderTop: 'none', marginTop: 12 }}>
                <span>
                    {formatter.format(amount / 100)} x {hours} hours
                </span>
                <span style={{ textAlign: 'right', marginLeft: 12 }}>
                    {formatter.format((amount / 100) * hours)}
                </span>
            </SimpleTableItem>
            <SimpleTableItem style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <span>Estimated total</span>
                <span style={{ textAlign: 'right', marginLeft: 12, color: '#122b48' }}>
                    {formatter.format((amount / 100) * hours)}
                </span>
            </SimpleTableItem>
        </>
    );
};

const SuccessMessage = ({ translate, userId }) => {
    const { showPrompt, pushShouldBeEnabled } = usePushNotifications({ userId });

    return (
        <Col
            style={{
                marginTop: '42px',
                width: '100%',
            }}
        >
            <Title>Thanks</Title>
            <Body>{translate('post-event-succes-message')}</Body>
            {pushShouldBeEnabled && (
                <>
                    <Body style={{ marginBottom: 9 }}>
                        {translate('post-event-succes-message-2')}
                    </Body>
                    <PrimaryButton onClick={showPrompt}>Get notifications</PrimaryButton>
                </>
            )}
        </Col>
    );
};

export default Booking;
