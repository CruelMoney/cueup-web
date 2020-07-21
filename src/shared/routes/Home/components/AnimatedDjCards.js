import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SuperEllipse, { Preset } from 'react-superellipse';
import { useTransition, animated } from 'react-spring';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import GracefullImage from 'components/GracefullImage';
import { Body, BodySmall } from 'components/Text';
import { Col, Row, RowWrap } from 'components/Blocks';
import { FEATURED_DJS } from '../gql';

const DataWrapper = () => {
    const { data, loading } = useQuery(FEATURED_DJS);

    const djs = data?.featuredDjs || [];

    if (loading) {
        return null;
    }

    return <AnimatedDjCards djs={djs.filter((dj) => !!dj.picture && dj.genres.length)} />;
};

const AnimatedDjCards = ({ djs }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const i = setInterval(() => {
            if (document.visibilityState === 'visible') {
                setIndex((idx) => {
                    const next = idx + 1;
                    return next >= djs.length ? 0 : next;
                });
            }
        }, 6000);

        return () => clearInterval(i);
    }, [djs]);

    const currentDj = djs[index];

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
            initial: (item) => ({ translateY: item.idx * 100 - 50 }),
            from: (item) => ({ translateY: item.idx * 100 - 50 + 300 }),
            enter: (item) => ({ translateY: item.idx * 100 - 50 }),
            leave: (item) => ({ translateY: item.idx * 100 - 50 - 300 }),
            native: true,
        }
    );

    return (
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
                        <Card p1={10} p2={32}>
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
    );
};

const InnerContent = ({ userMetadata, artistname, playingLocations, picture, genres, isNew }) => {
    const location = playingLocations?.[0]?.name;

    return (
        <NavLink to="/" draggable={false}>
            <GracefullImage
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
                            <Body white style={{ marginTop: '0.3em' }}>
                                <InlineIcon icon={pinIcon} /> {location}
                            </Body>
                        )}
                    </Col>
                    <Col style={{ maxWidth: '40%' }}>
                        <RowWrap right>
                            {genres.map((g, idx) => (
                                <Pill key={idx}>{g.trim()}</Pill>
                            ))}
                        </RowWrap>
                    </Col>
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

const Container = styled.div`
    position: absolute;
    top: 0;
    right: -1.5em;
    display: flex;
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
    top: 0;
    left: 0;
`;

const Card = styled(SuperEllipse)`
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    transition: transform 1000ms ease;
    transform: scale(1);
    &:hover {
        transform: scale(1.05);
    }
`;

export default DataWrapper;
