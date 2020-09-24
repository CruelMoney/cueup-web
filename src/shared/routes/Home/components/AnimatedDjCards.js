import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransition, animated } from 'react-spring';
import { useQuery } from 'react-apollo';
import useWindowSize from 'components/hooks/useWindowSize';

import { useServerContext } from 'components/hooks/useServerContext';
import { FEATURED_DJS } from '../gql';
import FeaturedDJCard from '../../../components/FeaturedDJCard';

const DataWrapper = () => {
    const { environment } = useServerContext();

    const { data, loading } = useQuery(FEATURED_DJS, {
        variables: {
            countryCode: environment.COUNTRY_CODE,
        },
    });

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
                            <FeaturedDJCard
                                onMouseEnter={() => setPauseanimation(true)}
                                onMouseLeave={() => setPauseanimation(false)}
                                item={item.isDj ? item : null}
                            />
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
