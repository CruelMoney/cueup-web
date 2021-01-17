import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransition, animated, config } from 'react-spring';

import { Icon, InlineIcon } from '@iconify/react';
import peopleIcon from '@iconify/icons-ion/people';
import timeIcon from '@iconify/icons-ion/time';

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BodySmall } from 'components/Text';
import { Container, ReadMore } from 'components/Blocks';
import GracefullImage from 'components/GracefullImage';
import { appRoutes } from 'constants/locales/appRoutes';
import { ResponsiveTextAccent } from '../components/blocks/TextAccent';
import cph from '../assets/maps/cph.png';
import la from '../assets/maps/la.png';
import nyc from '../assets/maps/nyc.png';
import bali from '../assets/maps/bali.png';
import { GrayText, Header } from './Text';

const gigCards = [
    {
        id: 1,
        guests: '120 guests',
        name: 'Wedding',
        duration: '6 hours',
        date: 'In 2 weeks',
        img: cph,
        status: 'Make your offer',
    },
    {
        id: 2,
        guests: '40 guests',
        name: 'Birthday Bash',
        duration: '4 hours',
        date: 'In 1 month',
        img: la,
        status: 'Gig confirmed',
    },
    {
        id: 3,
        guests: '70 guests',
        name: 'Beach Wedding',
        duration: '4 hours',
        date: 'In 3 weeks',
        img: bali,
        status: 'Awaiting organizer',
    },
    {
        id: 4,
        guests: '100 guests',
        name: 'New Years',
        duration: '4 hours',
        date: 'In 2 month',
        img: nyc,
        status: 'Gig confirmed',
    },
];

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 5;
    padding: 250px 0;

    @media only screen and (max-width: 768px) {
        padding: 150px 0 50px 0;
    }
`;

const GettingGigsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
    padding-left: 130px;
    @media only screen and (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-left: 0px;
    }
`;

const TextCol = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 50px;
    max-width: 425px;
    a {
        margin-top: 20px;
    }
    @media only screen and (max-width: 768px) {
        padding: 0;
        margin-left: 0px;
        margin-top: -50px;
        a {
            margin: auto;
            margin-top: 20px;
        }
    }
`;

const CardsWrapper = styled.ul`
    position: relative;
    width: 50%;
    perspective: 350px;
    perspective-origin: center;
    width: 25em;
    top: 6em;
    right: 6em;
    height: 20em;

    @media only screen and (max-width: 768px) {
        top: 0;
        right: 0;
    }
`;

const GigRequestBubble = styled.div`
    position: absolute;
    height: 2.2em;
    width: 12em;
    border-radius: 1em;
    background: #00d1ff;
    right: 5em;
    top: 1em;
    z-index: 5;
    @media only screen and (max-width: 768px) {
        top: -6em;
        right: -1em;
    }

    > p {
        text-align: center;
        color: #fff;
        font-size: 1em;
        font-weight: 600;
        line-height: 2.2em;
    }
`;

const GigCard = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 6px;
    width: 25em;
    height: 14em;
    background: #fff;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3),
        0 -12px 36px -8px rgba(0, 0, 0, 0.025);

    > * {
        flex: 1;
    }
    .location-map {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .content {
        padding: 1em;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    h4 {
        text-transform: capitalize;
        margin-bottom: 0.75em;
        font-size: 1.3em;
    }
    .top {
        border-bottom: 1px solid #ebebeb;
        margin-bottom: 0.5em;
    }
    .bottom {
        display: flex;
        p {
            margin-top: -0.2em;
        }
    }

    p {
        font-size: 0.9em;
        line-height: 1.7em;
    }
`;

const GigRequestsWrapper = styled.div`
    position: relative;
    @media only screen and (max-width: 685px) {
        transform: scale(0.6);
        height: 270px;
    }
`;

const Gig = ({ name, img, date, status, duration, guests }) => {
    return (
        <GigCard>
            <div>
                <div className="content">
                    <div className="top">
                        <h4>{name}</h4>
                    </div>
                    <BodySmall>{date}</BodySmall>
                    <BodySmall>{status}</BodySmall>
                    <div style={{ flex: 1 }} />
                    <div className="bottom">
                        <div style={{ marginRight: '2em' }}>
                            <Icon icon={timeIcon} style={{ fontSize: '1.2em' }} color="#98A4B3" />
                            <BodySmall>{duration}</BodySmall>
                        </div>
                        <div>
                            <Icon icon={peopleIcon} style={{ fontSize: '1.2em' }} color="#98A4B3" />
                            <BodySmall>{guests}</BodySmall>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <GracefullImage lazyload src={img} className="location-map" alt="map" />
            </div>
        </GigCard>
    );
};

const AnimatedCards = () => {
    const [cards, set] = useState([...gigCards]);

    const Offset = 32;
    const transitions = useTransition(
        cards.map((data, idx) => ({
            ...data,
            y: idx * Offset,
            opacity: idx === cards.length - 1 ? -1 : 1,
        })),
        (item) => item.id,
        {
            native: true,
            from: { opacity: 0 },
            leave: { opacity: 0 },
            enter: ({ y }) => ({ y, opacity: -1 }),
            update: ({ y, opacity }) => ({ y, opacity }),
            config: config.molasses,
        }
    );

    useEffect(() => {
        const rotate = () => set((cc) => [cc.pop(), ...cc]);
        rotate();
        const int = setInterval(rotate, 3000);
        return () => clearInterval(int);
    }, []);

    return (
        <GigRequestsWrapper>
            <GigRequestBubble>
                <p>NEW GIG REQUEST</p>
            </GigRequestBubble>

            <CardsWrapper>
                {transitions.map(({ item, props: { y, ...rest }, key }) => (
                    <animated.li
                        key={key}
                        style={{
                            ...rest,
                            transform: y.interpolate(
                                (y) => `translate3d(0,${(-1 * y) / 2}px,${y}px)`
                            ),
                        }}
                    >
                        <Gig {...item} />
                    </animated.li>
                ))}
            </CardsWrapper>
        </GigRequestsWrapper>
    );
};

const GettingGigs = () => {
    const { t } = useTranslation();

    return (
        <Bg>
            <Container>
                <GettingGigsWrapper>
                    <AnimatedCards />
                    <TextCol>
                        <ResponsiveTextAccent>EARN MONEY</ResponsiveTextAccent>
                        <Header bigMobile>
                            {t('become-dj:getting-gigs.get-gigs-feature.get-gigs')}
                        </Header>
                        <GrayText>
                            At Cueup we constantly work on bringing gigs to our DJs. You just have
                            to chat the organizer - make your offer - play - get paid.
                        </GrayText>
                        <NavLink to={t(appRoutes.signUp)}>
                            <ReadMore size="18px" uppercase={false}>
                                Sign up
                            </ReadMore>
                        </NavLink>
                    </TextCol>
                </GettingGigsWrapper>
                <BodySmall style={{ textAlign: 'center', margin: '0 35px', marginTop: '60px' }}>
                    Amount of available gigs vary depending on your area.
                </BodySmall>
            </Container>
        </Bg>
    );
};

export default GettingGigs;
