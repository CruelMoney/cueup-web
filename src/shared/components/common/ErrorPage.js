import React from 'react';
import * as Sentry from '@sentry/react';
import { withRouter } from 'react-router';
import { SecondaryButton } from 'components/Blocks';
import EmptyPage from './EmptyPage';
import ErrorMessageApollo from './ErrorMessageApollo';

const ErrorPage = ({ children }) => {
    return (
        <Sentry.ErrorBoundary fallback={ErrorFallBack} showDialog>
            {children}
        </Sentry.ErrorBoundary>
    );
};

const ErrorFallBack = ({ error }) => {
    return (
        <EmptyPage
            style={{ height: '100vh' }}
            title={'Something went wrong'}
            message={
                <span>
                    Sorry, something went wrong.
                    <br />
                    Try reloading the page or go back.
                    <br />
                    <SecondaryButton
                        style={{ marginTop: '24px' }}
                        onClick={() => {
                            window.location = document.referrer;
                        }}
                    >
                        Reload
                    </SecondaryButton>
                    <ErrorMessageApollo error={error} />
                </span>
            }
        />
    );
};

export default withRouter(ErrorPage);
