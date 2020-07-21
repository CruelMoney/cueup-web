import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SuperEllipse, { Preset } from 'react-superellipse';
import { useTransition, animated } from 'react-spring';

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
const AnimatedDjCards = () => {
    const [data, setData] = useState(true);

    useEffect(() => {
        const i = setInterval(() => {
            if (document.visibilityState === 'visible') {
                setData((dd) => !dd);
            }
        }, 6000);

        return () => clearInterval(i);
    }, []);

    const transitions = useTransition(
        data
            ? [
                  { name: '1', id: 1, idx: 0 },
                  { name: '2', id: 2, idx: 1 },
                  { name: '3', id: 3, idx: 2 },
              ]
            : [
                  { name: '4', id: 4, idx: 0 },
                  { name: '5', id: 5, idx: 1 },
                  { name: '6', id: 6, idx: 2 },
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
                        <Card p1={10} p2={32} />
                    </AnimateItem>
                ))}
            </CardColumn>
            <CardColumn style={{ marginTop: '25%' }}>
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
                        <Card p1={10} p2={32} />
                    </AnimateItem>
                ))}
            </CardColumn>
        </Container>
    );
};

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
`;

export default AnimatedDjCards;
