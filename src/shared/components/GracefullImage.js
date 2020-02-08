import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useInView } from 'react-intersection-observer';

export const keyframeFadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }

`;
const StyledImg = styled(({ animate, keyframeFadeIn, alt, ...rest }) => (
    <img alt={alt} {...rest} />
))`
    opacity: 0;
    animation: ${keyframeFadeIn} 400ms ease forwards;
    animation-duration: ${({ animate }) => (animate ? '400ms' : '1ms')};
`;

function useImageLoaded({ src }) {
    const [loaded, setLoaded] = useState(false);
    React.useEffect(() => {
        if (src) {
            const mainImage = new Image();
            mainImage.onload = () => {
                setLoaded(true);
            };

            mainImage.src = src;
            return () => {
                mainImage.onload = () => {};
            };
        }
    }, [src]);

    return loaded;
}

const GracefullImage = ({ src, style, alt, animate, lazyload, ...props }) => {
    const [ref, inView] = useInView({
        rootMargin: '200px',
        triggerOnce: true,
    });

    let source = null;

    if (lazyload) {
        if (inView) {
            source = src;
        }
    } else {
        source = src;
    }

    const loaded = useImageLoaded({
        src: source,
    });

    if (!loaded) {
        return (
            <div
                ref={lazyload ? ref : null}
                style={{
                    ...style,
                    backgroundColor: '#EFF2F5',
                }}
                {...props}
            />
        );
    }

    return <StyledImg src={src} style={style} alt={alt} animate={animate} {...props} />;
};

export default GracefullImage;
