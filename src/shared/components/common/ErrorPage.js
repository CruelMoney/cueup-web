import React from 'react';
import * as Sentry from '@sentry/react';
import { withRouter } from 'react-router';
import { SecondaryButton } from 'components/Blocks';
import EmptyPage from './EmptyPage';

const ErrorPage = ({ children }) => {
    return (
        <Sentry.ErrorBoundary fallback={ErrorFallBack} showDialog>
            {children}
        </Sentry.ErrorBoundary>
    );
};

const ErrorFallBack = () => {
    return (
        <div className="error-screen">
            <EmptyPage
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
                    </span>
                }
            />
        </div>
    );
};

export default withRouter(ErrorPage);
