import React, { useState } from 'react';
import './index.css';
import shuffle from 'lodash/shuffle';
import { DJs } from '../../../../constants/constants';
import DJCard from '../../../../components/common/DJCard';

export default () => {
    const [cards] = useState(DJs);

    return (
        <div className="dj-cards">
            <div>
                {cards.slice(0, 3).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
            <div>
                {cards.slice(3, 6).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
            <div>
                {cards.slice(6, 9).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
            <div>
                {cards.slice(9, 11).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
        </div>
    );
};
