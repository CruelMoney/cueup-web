import React from 'react';

import { Input } from '../src/shared/components/FormComponents';

export default {
    title: 'Input',
};

export const formatted = () => (
    <div style={{ width: '500px' }}>
        <Input
            label="URL"
            placeholder="https://cueup.io/"
            type="formatted-text"
            defaultValue={'username'}
            onSave={async (permalink) => {
                console.log({ permalink });
            }}
        />
    </div>
);
