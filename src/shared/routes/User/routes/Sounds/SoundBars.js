import React, { useEffect, useRef, useState } from 'react';
import { useMeasure } from '@softbind/hook-use-measure';
import styled, { keyframes, css } from 'styled-components';
import { Row } from '../../../../components/Blocks';
import useSamples from './useSamples';

const demoSoundSamples = Array.from({ length: 101 }, (_, idx) =>
    Math.max(Math.abs(Math.round(Math.sin(idx / 8) * 100)), 0)
);

const SoundBars = ({
    loading,
    progress,
    samples,
    duration,
    setScanningPosition,
    small,
    scanningPosition,
    jumpOrStart,
    style,
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!samples || samples.length === 0) {
        samples = demoSoundSamples;
    }

    const ref = useRef(null);
    const { bounds } = useMeasure(ref, 'bounds');

    const onScanning = (event) => {
        if (bounds) {
            const { touches } = event;
            let { clientX } = event;
            if (touches) {
                clientX = touches[0].clientX;
            }
            const x = clientX - bounds.left;
            const scan = (x / bounds.width).toFixed(4);
            setScanningPosition(scan);
        }
    };

    const resolution = bounds ? bounds.width / 5 : small ? 75 : 140;

    const bars = useSamples({ resolution, samples });
    const position = progress / duration.totalSeconds;
    const positionIdx = bars.length * position;
    const scanningIdx = bars.length * scanningPosition;
    let activeIdx = positionIdx;
    let halfActiveIdx = scanningIdx;

    if (scanningPosition && scanningIdx < positionIdx) {
        activeIdx = scanningIdx;
        halfActiveIdx = positionIdx;
    }

    return (
        <SoundBarsRow
            ref={ref}
            onMouseMove={onScanning}
            dataLoading={loading || undefined}
            onMouseLeave={() => setScanningPosition(null)}
            onTouchMove={onScanning}
            onTouchCancel={() => setScanningPosition(null)}
            onTouchEnd={jumpOrStart}
            onClick={jumpOrStart}
            small={small}
            style={style}
        >
            {mounted &&
                bars.map((p, idx) => (
                    <SoundBar
                        hovering={scanningPosition}
                        key={idx}
                        idx={idx}
                        pressure={p}
                        active={idx < activeIdx}
                        halfActive={idx < halfActiveIdx}
                    />
                ))}
        </SoundBarsRow>
    );
};

const loadingPulse = keyframes`
  from{
    opacity: 1;
  }
  to{
    opacity: 0.3;
  }
`;

const pulseLoad = ({ dataLoading }) =>
    dataLoading
        ? css`
              animation: ${loadingPulse} 1000ms cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite
                  alternate;
          `
        : null;

const growIn = keyframes`
    from {
        transform: scaleY(0);
    }

    to {
        transform: scaleY(1);
    }
`;

const SoundBarStyle = styled.span.attrs(({ idx, pressure, active, halfActive, hovering }) => ({
    style: {
        height: `${pressure}%`,
        background: active ? '#50e3c2' : halfActive ? '#50e3c299' : '#E9ECF0',
        transition: 'height 1000ms ease',
        animationDelay: `${idx * 5}ms`,
    },
}))`
    flex: 1;
    margin: 1px;
    border-radius: 10px;
    min-height: 4px;
    pointer-events: none;
    transform: scaleY(0);
    animation: ${growIn} 500ms forwards;
`;

const SoundBar = (props) => {
    return <SoundBarStyle {...props} />;
};

const SoundBarsRow = styled(Row)`
    height: ${({ small }) => (small ? '50px' : '80px')};
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    touch-action: none;
    ${pulseLoad}
    margin-top: 6px;
    margin-bottom: 4px;
`;

export default SoundBars;
