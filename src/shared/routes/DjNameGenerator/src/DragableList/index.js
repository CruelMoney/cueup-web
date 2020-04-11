// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import React, { useRef } from 'react';
import clamp from 'lodash-es/clamp';
import swap from 'lodash-move';
import { useDrag } from 'react-use-gesture';
import { useSprings, animated } from 'react-spring';

const ITEM_HEIGHT = 100;
const GAP = 10;
const SPACE = ITEM_HEIGHT + GAP;

// Returns fitting styles for dragged/idle items
const fn = (order, down, originalIndex, curIndex, y) => (index) =>
    down && index === originalIndex
        ? {
              y: curIndex * SPACE + y,
              scale: 1.1,
              zIndex: '1',
              shadow: 15,
              immediate: (n) => n === 'y' || n === 'zIndex',
          }
        : { y: order.indexOf(index) * SPACE, scale: 1, zIndex: '0', shadow: 1, immediate: false };

function DraggableList({ items, onOrderChanged }) {
    const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order

    // add new items to order íf changed
    if (items.length > order.current.length) {
        order.current = [...order.current, items.length - 1];
    }

    const [springs, setSprings] = useSprings(items.length, fn(order.current), [items]); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

    const bind = useDrag(
        ({ args: [originalIndex], down, last, movement: [x, y] }) => {
            const curIndex = order.current.indexOf(originalIndex);
            const curRow = clamp(Math.round((curIndex * SPACE + y) / SPACE), 0, items.length - 1);
            const newOrder = swap(order.current, curIndex, curRow);
            setSprings(fn(newOrder, down, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
            if (!down) {
                order.current = newOrder;
            }
            if (last) {
                onOrderChanged(newOrder);
            }
        },
        {
            filterTaps: true,
        }
    );

    return (
        <div className="draggable-main">
            <div className="content" style={{ height: items.length * SPACE + GAP }}>
                {springs.map(({ zIndex, shadow, y, scale }, i) => (
                    <animated.div
                        {...bind(i)}
                        key={i}
                        className={'dragable-card' + (!items[i].enabled ? ' inactive' : '')}
                        style={{
                            zIndex,
                            boxShadow: shadow.to(
                                (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                            ),
                            y,
                            scale,
                            height: ITEM_HEIGHT,
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
