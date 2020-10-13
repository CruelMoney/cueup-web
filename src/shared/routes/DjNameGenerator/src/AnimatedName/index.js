import React, { useState, useEffect } from 'react';
import { useTrail, animated } from 'react-spring';
import './index.css';

const config = { mass: 5, tension: 2000, friction: 200 };

function AnimatedText({ content, onAnimated }) {
    const [items, setItems] = useState(content.split(' '));
    const [hide, setHide] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const run = async () => {
            onAnimated(false);
            if (!hide) {
                setHide(true);
                await new Promise((r) => setTimeout(r, items.length * 150 + 100));
            }
            setItems(content ? content.split(' ') : []);
            setHide(false);
            onAnimated(true);
        };

        if (mounted) {
            run();
        } else {
            setMounted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const trail = useTrail(items.length, {
        config,
        opacity: !hide ? 1 : 0,
        x: !hide ? 0 : 20,
        height: !hide ? 100 : 0,
        immediate: !mounted,
        from: { opacity: 0, x: 20, height: 0 },
    });

    return (
        <span className="trails-container">
            <span>
                {trail.map(({ x, height, ...rest }, index) => (
                    <animated.span
                        key={index}
                        className="trails-text"
                        style={{
                            ...rest,
                            transform: x.interpolate((x) => `translate3d(0,${x}px,0)`),
                        }}
                    >
                        <animated.span style={{ height }}>{items[index]}</animated.span>
                    </animated.span>
                ))}
            </span>
        </span>
    );
}

export default AnimatedText;
