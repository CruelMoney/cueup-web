import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';
import SuperEllipse, { Preset } from 'react-superellipse';
import { useHistory, useRouteMatch, useLocation } from 'react-router';
import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { Body } from 'components/Text';
import { Col, SmartButton } from 'components/Blocks';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import { useForm } from 'components/hooks/useForm';
import { useCheckDjAvailability } from 'actions/EventActions';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import Footer from '../../../components/common/Footer';

import content from '../content.json';
import AnimatedDjCards from './AnimatedDjCards';

const DjSearch = () => {
    const routeLocation = useLocation();
    const history = useHistory();
    const locationRef = useRef();
    const dateRef = useRef();
    const { registerValidation, unregisterValidation, runValidations, form, setValue } = useForm();

    const [check, { loading, error }] = useCheckDjAvailability();

    const submit = async (e) => {
        e.preventDefault();

        if (!form.locationName) {
            locationRef.current.focus();
            return;
        }

        if (!form.date) {
            dateRef.current.focus();
            return;
        }

        const errors = runValidations();
        if (errors.length === 0) {
            const { result, date, timeZoneId, location } = await check(form);

            if (result === true) {
                const route = routeLocation.pathname + 'book-dj';
                console.log({ route });
                history.push({
                    pathname: route,
                    state: {
                        activeStep: 2,
                        date,
                        timeZoneId,
                        location,
                    },
                });
            }
        }
    };

    return (
        <>
            <StyledSearchWrapper>
                <SearchWrapperBg r1={Preset.iOS.r1} r2={Preset.iOS.r2} />

                <LocationSelector
                    ref={locationRef}
                    name="query"
                    label={'LOCATION'}
                    placeholder={"Where's the event?"}
                    wrapperStyle={{ flex: 1, height: '100%', display: 'flex', marginBottom: 0 }}
                    onSave={(locationName) => setValue({ locationName })}
                    validation={(v) => (v ? null : 'Please select a location')}
                    registerValidation={registerValidation('locationName')}
                    unregisterValidation={unregisterValidation('locationName')}
                    defaultValue={form.locationName}
                />

                <Divider />
                <DatePickerPopup
                    ref={dateRef}
                    label="WHEN"
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    validation={(v) => (v ? null : 'Please select a date')}
                    onSave={(date) => setValue({ date })}
                    registerValidation={registerValidation('date')}
                    unregisterValidation={unregisterValidation('date')}
                />

                <FindDjsButton perEllipse r1={Preset.iOS.r1} r2={Preset.iOS.r2}>
                    <SmartButton
                        primary
                        loading={loading}
                        style={{ fontSize: '0.14em', height: '3em', minWidth: '6em' }}
                        onClick={submit}
                    >
                        Find DJs
                    </SmartButton>
                </FindDjsButton>
            </StyledSearchWrapper>
            <ErrorMessageApollo style={{ marginTop: '0.1em' }} error={error} />
        </>
    );
};

const Hero = () => {
    return (
        <HeroContainer>
            <Container>
                <LeftSide>
                    <Accent>1000+ successful events</Accent>
                    <Title>
                        Find DJs for parties <br />
                        and events
                    </Title>
                    <LandingBody>
                        Cueup is the easiest way for you to book a great DJ for your event. Start by
                        telling us about your event, and get prices from the DJs in your area.
                    </LandingBody>
                    <DjSearch />
                </LeftSide>
            </Container>
            <AnimatedDjCards />
            <MobileLayover />
        </HeroContainer>
    );
};

const Home = () => {
    const { translate } = useNamespaceContent(content, 'home');

    return (
        <div>
            <Hero />
            <Footer
                noSkew
                bgColor="#FFFFFF"
                firstTo={translate(appRoutes.signUp)}
                secondTo={translate(appRoutes.howItWorks)}
                firstLabel={translate('apply-to-become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('home:footer.first')}
                subTitle={translate('home:footer.second')}
            />
        </div>
    );
};

const Divider = styled.div`
    height: 60%;
    width: 2px;
    background: #d8d8d8;
`;
const StyledSearchWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0.6em;
    margin-top: 0.3em;
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #fff;
    border-radius: 20px;
    label,
    ${Label} {
        flex: 1;
        color: #32325d;
        font-size: 0.1em;
        padding-left: 1.7em;
        height: 100%;
        font-weight: 600;
        letter-spacing: 0.08em;
        padding-top: 1.25em;
        margin-bottom: 0;
        min-width: 0;
        > input,
        > button {
            font-size: 1.5em;
            display: block;
            border: none;
            outline: none;
            background: transparent;
            text-indent: 0px;
            margin-top: 0;
            margin-left: -1px;
            height: 1.4em;
            line-height: 1em !important;
            width: auto;
        }
        .empty {
            color: #98a4b3;
        }
    }

    ul {
        top: 0;
        left: 0;
        right: -18.7em;
        padding-top: 4em;
        border-radius: 1.4em;
    }
    .powered-by-google {
        top: 1.5em !important;
        display: flex;
        right: 1em !important;
    }
    .error {
        display: none;
    }
`;

const SearchWrapperBg = styled(SuperEllipse)`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: -1;
`;

const HeroContainer = styled.section`
    background: radial-gradient(114.62% 129.84% at 45.24% 67.36%, #122b48 0%, #000000 100%);
    min-height: 7.8em;
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 6.94444vw;
    color: #fff;
    position: relative;
    @media only screen and (max-width: 1024px) {
        font-size: 13.02083vw;
        min-height: 6.5em;
    }
    @media only screen and (max-width: 480px) {
        min-height: 12em;
    }
`;

const MobileLayover = styled.div`
    background: radial-gradient(114.62% 129.84% at 45.24% 67.36%, #122b48 0%, #000000 100%);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
    display: none;

    @media only screen and (max-width: 480px) {
        display: block;
    }
`;

const Container = styled.div`
    margin: 0 auto;
    max-width: 1260px;
    padding: 0 30px;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 0.42em;
    line-height: 1.3em;
    @media only screen and (max-width: 1024px) {
        font-size: 0.35em;
    }
    @media only screen and (max-width: 480px) {
        font-size: 0.3em;
    }
`;

const LandingBody = styled(Body)`
    font-size: 0.16em;
    line-height: 1.5em;
    color: #fff;
`;

const Accent = styled.p`
    color: #00d1ff;
    font-weight: 700;
    font-size: 0.15em;
    margin-bottom: 0.75em;
`;

const LeftSide = styled(Col)`
    max-width: 50%;
    font-size: 120px;
    z-index: 2;
    position: relative;
    @media only screen and (max-width: 1024px) {
        font-size: 100px;
    }
    @media only screen and (max-width: 480px) {
        max-width: 100%;
        padding-top: 1.2em;
        padding-bottom: 0.5em;
    }
`;

const FindDjsButton = styled(SuperEllipse)`
    position: absolute;
    right: 0.1em;
    top: 50%;
    transform: translateY(-50%);
`;

export default withTranslation()(Home);
