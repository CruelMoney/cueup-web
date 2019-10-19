import React from 'react';

import ApolloProvider from '../src/shared/ApolloProvider';
import { DisconnectedPayoutForm } from '../src/shared/components/common/PayoutForm';

export default {
    title: 'Payoutform',
};

export const formatted = () => (
    <div style={{ width: '500px' }}>
        <ApolloProvider>
            <DisconnectedPayoutForm user={{ userMetadata: {} }} translate={(t) => t} />
        </ApolloProvider>
    </div>
);
