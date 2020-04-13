// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import React, { useRef, useEffect, useCallback, useState } from 'react';
import clamp from 'lodash/clamp';
import swap from 'lodash-move';
import { useDrag } from 'react-use-gesture';
import { useSprings, animated, interpolate } from 'react-spring';
import { useMeasure } from '@softbind/hook-use-measure';

const GAP = 10;

function DraggableList({ items, onOrderChanged }) {
    const [ITEM_HEIGHT, setHeight] = useState(100);
    const cardRef = useRef();
    const SPACE = ITEM_HEIGHT + GAP;

    const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order

    // add new items to order íf changed
    if (items.length > order.current.length) {
        order.current = [...order.current, items.length - 1];
    }

    // Returns fitting styles for dragged/idle items
    const fn = useCallback(
        (order, down, originalIndex, curIndex, y) => (index) =>
            down && index === originalIndex
                ? {
                      y: curIndex * SPACE + y,
                      scale: 1.1,
                      zIndex: '1',
                      shadow: 15,
                      immediate: (n) => n === 'y' || n === 'zIndex',
                  }
                : {
                      y: order.indexOf(index) * SPACE,
                      scale: 1,
                      zIndex: '0',
                      shadow: 1,
                      immediate: false,
                  },
        [SPACE]
    );

    const [springs, setSprings] = useSprings(items.length, fn(order.current), [items]); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

    let scrollAbleArea = null;

    const bind = useDrag(
        ({ args: [originalIndex], down, last, first, movement: [x, y] }) => {
            scrollAbleArea = scrollAbleArea ? scrollAbleArea : document.querySelector('.left-area');
            const curIndex = order.current.indexOf(originalIndex);
            const curRow = clamp(Math.round((curIndex * SPACE + y) / SPACE), 0, items.length - 1);
            const newOrder = swap(order.current, curIndex, curRow);
            setSprings(fn(newOrder, down, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
            if (!down) {
                order.current = newOrder;
            }
            if (first) {
                scrollAbleArea.style.overflowY = 'hidden';
            }
            if (last) {
                onOrderChanged(newOrder);
                scrollAbleArea.style.overflowY = 'scroll';
            }
        },
        {
            filterTaps: true,
        }
    );

    const { bounds } = useMeasure(cardRef, 'bounds');

    useEffect(() => {
        if (bounds) {
            setHeight(bounds.height);
            setSprings(fn(order.current));
        }
    }, [bounds, fn, setSprings]);

    return (
        <div className="draggable-main">
            <div className="content" style={{ height: items.length * SPACE + GAP }}>
                {springs.map(({ zIndex, shadow, y, scale }, i) => (
                    <animated.div
                        {...bind(i)}
                        key={i}
                        ref={i === 0 ? cardRef : null}
                        className={'dragable-card' + (!items[i].enabled ? ' inactive' : '')}
                        style={{
                            zIndex,
                            boxShadow: shadow.interpolate(
                                (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                            ),
                            transform: interpolate(
                                [y, scale],
                                (y, s) => `translate3d(0,${y}px,0) scale(${s})`
                            ),
                        }}
                    >
                        {items[i].Component}
                    </animated.div>
                ))}
            </div>
        </div>
    );
}

export default DraggableList;
