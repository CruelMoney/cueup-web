import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Globe from './GlobeNew';

const GlobeRender = () => {
    const ref = useRef();

    useEffect(() => {
        const g = new Globe(ref.current);
        g.load();
        g.play();

        return () => {
            g.disconnect();
        };
    }, []);

    return <GlobeWrapper id="globe" ref={ref} />;
};

const GlobeWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`;

export default GlobeRender;
