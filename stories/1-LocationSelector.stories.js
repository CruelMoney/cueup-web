import React from 'react';

import LocationSelectorSimple from '../src/shared/components/common/LocationSelectorSimple';
import { Label } from '../src/shared/components/FormComponents';

export default {
    title: 'LocationSelector',
};

export const text = () => (
    <div style={{ width: '500px' }}>
        <LocationSelectorSimple
            name="location"
            label="Event Location"
            placeholder={'Placeholder'}
            validate={['required']}
        />
    </div>
);
