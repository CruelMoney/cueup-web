import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const GlobeRender = () => {
    const [inViewRef, inView] = useInView({
        rootMargin: '0px',
        triggerOnce: true,
    });
    const g = useRef();
    const ref = useRef();

    const prepareGlobe = useCallback(async () => {
        if (ref.current) {
            const Globe = await (await import('./GlobeNew')).default;
            g.current = new Globe(ref.current);
            g.current.load();
            g.current.play();
        }
    }, [ref]);

    useEffect(() => {
        if (inView) {
            const start = async () => {
                await prepareGlobe();
            };
            start();

            return () => {
                g.current.disconnect();
            };
        }
    }, [inView, prepareGlobe]);

    const setRefs = useCallback(
        (node) => {
            ref.current = node;
            inViewRef(node);
        },
        [inViewRef]
    );

    return <GlobeWrapper id="globe" ref={setRefs} />;
};

const GlobeWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`;

export default GlobeRender;
