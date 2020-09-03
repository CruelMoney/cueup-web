import React from 'react';
import { Redirect } from 'react-router';

const zendeskUrl = 'https://cueup.zendesk.com/hc';
const RedirectToZendesk = ({ staticContext }) => {
    return <Redirect to={zendeskUrl} />;
};

export default RedirectToZendesk;
