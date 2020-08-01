import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransition, animated } from 'react-spring';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import GracefullImage from 'components/GracefullImage';
import { Body } from 'components/Text';
import { Col, Row, RowWrap } from 'components/Blocks';
import useWindowSize from 'components/hooks/useWindowSize';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { FEATURED_DJS } from '../gql';

const DataWrapper = () => {
    const { data, loading } = useQuery(FEATURED_DJS);

    const djs = data?.featuredDjs || [];

    if (loading) {
        return null;
    }

    const filteredDjs = djs.filter((dj) => !!dj.picture && dj.genres.length);

    return <AnimatedDjCards djs={filteredDjs} />;
};

const AnimatedDjCards = ({ djs }) => {
    const { width } = useWindowSize();
    const [index, setIndex] = useState(0);
    const [pauseAnimation, setPauseanimation] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIndex((idx) => idx + 1);
        }, 1000);
    }, []);

    useEffect(() => {
        const i = setInterval(() => {
            if (document.visibilityState === 'visible' && !pauseAnimation) {
                setIndex((idx) => {
                    const next = idx + 1;
                    return next >= djs.length ? 0 : next;
                });
            }
        }, 6000);

        return () => clearInterval(i);
    }, [djs, pauseAnimation]);

    const currentDj = djs[index];

    const mobileOptions = width <= 480 ? { opacity: 0 } : {};
    const mobileOptions2 = width <= 480 ? { opacity: 1 } : {};

    const transitions = useTransition(
        [
            { id: index - 1, idx: 0 },
            { ...currentDj, isDj: true, idx: 1 },
            { id: index + 1, idx: 2 },
        ],
        (item) => item.id,
        {
            config: {
                duration: 2000,
                easing: easeInOutExpo,
            },
            trail: 100,
            order: ['leave', 'enter', 'update'],
            initial: (item) => ({ ...mobileOptions2, translateY: item.idx * 100 - 50 }),
            from: (item) => ({ ...mobileOptions, translateY: item.idx * 100 - 50 + 300 }),
            enter: (item) => ({ ...mobileOptions2, translateY: item.idx * 100 - 50 }),
            leave: (item) => ({ ...mobileOptions, translateY: item.idx * 100 - 50 - 300 }),
            native: true,
        }
    );

    return (
        <OverflowWrapper>
            <Container>
                <CardColumn>
                    {transitions.map(({ item, key, props }) => (
                        <AnimateItem
                            key={key}
                            style={{
                                ...props,
                                transform: props.translateY.interpolate(
                                    (y) => `translate3d(0,${y}%,0)`
                                ),
                            }}
                        >
                            <Card
                                p1={10}
                                p2={32}
                                onMouseEnter={() => setPauseanimation(true)}
                                onMouseLeave={() => setPauseanimation(false)}
                            >
                                {item.isDj && <InnerContent {...item} />}
                            </Card>
                        </AnimateItem>
                    ))}
                </CardColumn>
                <CardColumn style={{ marginTop: '25%' }}>
                    {transitions.map(({ key, props }) => (
                        <AnimateItem
                            key={key}
                            style={{
                                ...props,
                                transform: props.translateY.interpolate(
                                    (y) => `translate3d(0,${y}%,0)`
                                ),
                            }}
                        >
                            <Card p1={10} p2={32} />
                        </AnimateItem>
                    ))}
                </CardColumn>
            </Container>
        </OverflowWrapper>
    );
};

const InnerContent = ({
    userMetadata,
    artistname,
    playingLocations,
    picture,
    genres,
    isNew,
    permalink,
    ...props
}) => {
    const { translate } = useTranslate();

    const route = `${translate(appRoutes.user)}/${permalink}`;
    const location = playingLocations?.[0]?.name;

    return (
        <NavLink to={route} draggable={false}>
            <GracefullImage
                animate
                draggable={false}
                src={picture?.path}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    objectFit: 'cover',
                }}
            />
            <BottomGradient />
            <DjCardContent>
                <Row>{isNew && <Pill style={{ marginLeft: 0, marginTop: 0 }}>NEW</Pill>}</Row>
                <div style={{ flex: 1 }} />
                <Row between style={{ alignItems: 'flex-end' }}>
                    <Col>
                        <h3>{artistname || userMetadata?.firstName}</h3>
                        {location && (
                            <Body
                                white
                                style={{
                                    marginTop: '0.3em',
                                    fontSize: '0.15em',
                                    lineHeight: '1em',
                                }}
                            >
                                <InlineIcon icon={pinIcon} /> {location}
                            </Body>
                        )}
                    </Col>
                    {genres && (
                        <Col style={{ maxWidth: '40%' }}>
                            <RowWrap right>
                                {genres.slice(0, 5).map((g, idx) => (
                                    <Pill key={idx}>{g.trim()}</Pill>
                                ))}
                            </RowWrap>
                        </Col>
                    )}
                </Row>
            </DjCardContent>
        </NavLink>
    );
};

const Pill = styled(Body)`
    border-radius: 0.6em;
    font-size: 0.1em;
    line-height: 1em;
    background-color: #fff;
    padding: 0.4em 0.5em;
    font-weight: 500;
    letter-spacing: 1px;
    color: #122b48;
    text-transform: uppercase;
    margin-left: 0.5em;
    margin-top: 0.5em;
`;

const DjCardContent = styled.div`
    height: 100%;
    width: 100%;
    padding: 0.2em;
    position: relative;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;

    h3 {
        font-size: 0.2em;
        font-weight: 500;
        color: #fff;
    }
`;

const BottomGradient = styled.div`
    /* Rectangle 11 */
    position: absolute;
    height: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, #000000 22%, rgba(0, 0, 0, 0) 100%);
`;

const CardColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 0.3em;
    position: relative;
    width: 3.5em;
`;

const OverflowWrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: hidden;
`;

const Container = styled.div`
    position: absolute;
    top: 0;
    right: -1.5em;
    display: flex;
    @media only screen and (max-width: 1024px) {
        right: -3em;
        font-size: 0.75em;
    }
`;

function easeInOutExpo(x) {
    return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

const AnimateItem = styled(animated.div)`
    width: 3.5em;
    height: 4.2em;
    padding: 0.15em 0;
    will-change: transform, opacity;
    position: absolute;
    top: -0.15em;
    left: 0;
`;

const Card = styled.div`
    border-radius: 0.2em;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: transform 1000ms ease;
    transform: scale(1);
    &:hover {
        transform: scale(1.05);
    }
`;

export default DataWrapper;
