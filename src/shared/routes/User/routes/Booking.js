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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useCreateEvent } from 'actions/EventActions';
import { useForm } from 'components/hooks/useForm';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { CTAButton } from 'components/CTAButton';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import useUrlState from 'components/hooks/useUrlState';
import { ME } from 'components/gql';

import Step4 from 'components/common/RequestForm/Step4';
import RadioSelect from 'components/RadioSelect';
import { hideChatButton, showChatButton } from 'utils/supportChat';
import { useAppState } from 'components/hooks/useAppState';
import Logo from 'components/common/Logo';
import { Media } from 'components/MediaContext';
import { SettingsSection, Input, Label, InputRow } from '../../../components/FormComponents';
import DatePickerPopup from '../../../components/DatePickerPopup';
import {
    Row,
    Container,
    Col,
    GradientBg,
    PrimaryButton,
    TeritaryButton,
    Card,
    Avatar,
    SecondaryButton,
} from '../../../components/Blocks';
import ScrollToTop from '../../../components/common/ScrollToTop';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import { SmallHeader, TitleClean, Body, Title, BodySmall } from '../../../components/Text';
import RiderOptions from '../../../components/RiderOptions';
import TimeSlider from '../../../components/common/TimeSlider';
import Slider from '../../../components/common/Slider';
import Popup from '../../../components/common/Popup';
import Login from '../../../components/common/Login';
import ErrorMessageApollo from '../../../components/common/ErrorMessageApollo';
import GeoCoder from '../../../utils/GeoCoder';
import { MobileBookingButton } from '../components/Common';

const Booking = ({ user, loading, translate }) => {
    const { setAppState } = useAppState();
    const [eventCreated, setEventCreated] = useState(false);
    const { data: userData } = useQuery(ME);
    const [create, { loading: createLoading, error }] = useCreateEvent();
    const [errorMessage, setError] = useState();
    const [loginPopup, setloginPopup] = useState(false);
    const [signupPopup, setSignupPopup] = useState(false);

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
        speakers: false,
        lights: false,
        contactName: userData?.me?.userMetadata.fullName,
        contactEmail: userData?.me?.email,
        contactPhone: userData?.me?.userMetadata.phone,
        openForAllDjs: true,
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const setValue = (data) => setForm((f) => ({ ...f, ...data }));

    const requestBooking = async () => {
        const refs = runValidations(true);
        console.log(refs);
        if (refs.length) {
            return;
        }

        if (!userData?.me && !signupPopup) {
            setSignupPopup(true);
            return;
        }

        try {
            setSignupPopup(false);
            const { timeZoneId } = await GeoCoder.getTimeZone({
                lat: user.playingLocation.latitude,
                lng: user.playingLocation.longitude,
            });

            const result = await create({
                ...form,
                timeZone: timeZoneId,
                djId: user.id,
                genres: user.genres,
                location: {
                    latitude: user.playingLocation.latitude,
                    longitude: user.playingLocation.longitude,
                    name: user.playingLocation.name,
                },
            });

            const { data } = result;
            setEventCreated(data?.createEvent);
        } catch (error) {
            setError(error);
            Sentry.captureException(error);
        }
    };

    const profileUrl = `${translate(appRoutes.user)}/${user.permalink}/${userRoutes.overview}`;

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
                    buttonLabel="Book now"
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
                {user.isOwn && <AddBookingLink user={user} />}

                <NavLink to={profileUrl}>
                    <TeritaryButton
                        style={{
                            marginLeft: -15,
                            marginBottom: -24,
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
                />
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
    .logo-row {
        display: flex;
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
`;

const GreyBox = styled.section`
    background-color: #f7f9fc;
    border-radius: 12px;
    width: 100%;
    padding: 20px 30px;
    margin-left: auto;

    margin-bottom: 60px;
    margin-top: 30px;
    position: relative;
    max-width: 550px;
    left: 50%;
    transform: translateX(-50%);
    label {
        margin-top: 15px;
        margin-bottom: 0;
        margin-top: 0;
        margin-right: 0 !important;
        min-width: 0 !important;
    }
    input {
        background-color: white !important;
        cursor: text;
    }
`;

const AddBookingLink = ({ user }) => {
    const [copied, setCopied] = useState(false);
    const link = `https://cueup.io/${user.permalink}/book`;

    return (
        <GreyBox>
            <h2>Your booking link</h2>
            <Body>
                Make it easier for people to book you on your link. Copy paste the link to your
                website and social media.
            </Body>

            <Row style={{ marginTop: 12 }}>
                <Input value={link} />

                <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                    <SecondaryButton disabled={copied}>
                        {copied ? 'Copied' : 'Copy link'}
                    </SecondaryButton>
                </CopyToClipboard>
            </Row>
        </GreyBox>
    );
};

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
                    marginBottom: '60px',
                    zIndex: 0,
                    position: 'relative',
                    minHeight: 'calc(100vh - 135px)',
                }}
            >
                <SettingsSection
                    small
                    stickyTop={'24px'}
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
                        validation={(v) => (v ? null : 'Please select a date')}
                        registerValidation={registerValidation('date')}
                        unregisterValidation={unregisterValidation('date')}
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
                                speakers: form.speakers,
                                lights: form.lights,
                            }}
                            onSave={({ speakers, lights }) => {
                                setValue({ speakers, lights });
                            }}
                        />
                    </div>

                    <Input
                        v2
                        type="text-area"
                        label={'Description'}
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

                    {/* <RadioSelect
                        containerStyle={{ width: 'auto', marginRight: 44, marginBottom: 20 }}
                        multi
                        setChosen={() => setValue({ openForAllDjs: !form.openForAllDjs })}
                        options={[
                            {
                                checked: form.openForAllDjs,
                                title: 'Allow other DJs to make offers',
                                description:
                                    "Other DJs in the area can make an offer if they're interested in your event.",
                                value: 'openForAllDjs',
                            },
                        ]}
                    /> */}

                    <Media lessThan="md">
                        <a
                            className="logo-row"
                            href={'https://cueup.io'}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <BodySmall>Powered by</BodySmall>
                            <Logo height={16} width="auto" />
                        </a>
                    </Media>
                </SettingsSection>
                <Media greaterThanOrEqual="md">
                    <a
                        className="logo-row"
                        href={'https://cueup.io'}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <BodySmall>Powered by</BodySmall>
                        <Logo height={16} width="auto" />
                    </a>
                </Media>
            </Col>
        )}

        <BookingSidebar
            key={loginPopup}
            loading={loading}
            user={user}
            values={form}
            eventCreated={eventCreated}
            {...props}
        />
    </EventFormWrapper>
);

const BookingSidebar = ({
    loading,
    values,
    requestBooking,
    eventCreated,
    error,
    createLoading,
    showLogin,
    ...props
}) => {
    const { user } = props;
    return (
        <>
            <SideBar>
                <Card style={{ minWidth: 300 }}>
                    <div className="content">
                        {loading ? <LoadingPlaceholder2 /> : <Content values={values} {...props} />}
                    </div>

                    <CTAButton
                        data-cy="book-button"
                        disabled={createLoading || eventCreated}
                        loading={createLoading}
                        onClick={requestBooking}
                        noIcon
                        style={{ width: '100%', paddingLeft: 0 }}
                    >
                        {eventCreated ? 'BOOKING DONE' : `BOOK ${user.title}`.toUpperCase()}
                    </CTAButton>
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
                <CTAButton
                    type="submit"
                    disabled={createLoading || eventCreated}
                    loading={createLoading}
                    onClick={requestBooking}
                    noIcon
                    style={{ paddingLeft: 0 }}
                >
                    {eventCreated ? 'BOOKING DONE' : `BOOK ${user.title}`.toUpperCase()}
                </CTAButton>
            </MobileBookingButton>
        </>
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

const Content = ({ user, values }) => {
    const { artistName, userMetadata } = user;
    const { firstName } = userMetadata;

    const { guestsCount, date, speakers, lights, startMinute, endMinute, name } = values;

    return (
        <>
            <h1 style={{ marginBottom: '15px', fontSize: 16 }}>{`Your booking: ${
                artistName || firstName
            }`}</h1>
            {name && <SidebarRow>{name}</SidebarRow>}
            <SidebarRow>{moment(date).format('dddd Do MMMM, YYYY')}</SidebarRow>
            <SidebarRow>
                From {moment(date).startOf('day').add(startMinute, 'minutes').format('HH:mm')} to{' '}
                {moment(date).startOf('day').add(endMinute, 'minutes').format('HH:mm')}
            </SidebarRow>
            <SidebarRow>{guestsCount} guests</SidebarRow>
            {speakers && <SidebarRow>Including speakers</SidebarRow>}
            {lights && <SidebarRow>Including lights</SidebarRow>}
            <div>
                <SimpleTableItem>
                    <span>Total</span>
                    <span style={{ textAlign: 'right', marginLeft: 12 }}>
                        DJ will respond with price
                    </span>
                </SimpleTableItem>
            </div>
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
