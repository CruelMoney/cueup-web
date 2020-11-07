import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import Notification from './common/Notification';
import { VERIFY_EMAIL } from './gql';
import ErrorMessageApollo from './common/ErrorMessageApollo';

const EmailVerifier = ({ onVerified }) => {
    const [state, setState] = useState({});
    const { verifyToken, isEmailValidation, redirectLink } = state;

    const history = useHistory();
    const location = useLocation();

    const onCompleted = () => {
        if (redirectLink) {
            const redirect = decodeURIComponent(redirectLink);
            window.location.href = redirect;
            return;
        }
        history.replace(location.pathname);
        if (onVerified) {
            onVerified();
        }
    };

    const [mutate, { loading, data, error }] = useMutation(VERIFY_EMAIL, {
        variables: { verifyToken },
        onCompleted,
    });

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const verifyToken = parsedUrl.searchParams.get('token');
        const isEmailValidation = parsedUrl.searchParams.get('emailVerification');
        const redirectLink = parsedUrl.searchParams.get('redirectLink');

        setState({ isEmailValidation, verifyToken, redirectLink });
    }, []);

    if (!verifyToken || !isEmailValidation) {
        return null;
    }

    return <EmailVerifyIndicator mutate={mutate} loading={loading} data={data} error={error} />;
};

const EmailVerifyIndicator = ({ mutate, loading, data, error }) => {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            await mutate();
        };
        verifyEmail();
    }, [mutate]);

    useEffect(() => {
        if (loading === false) {
            const r = setTimeout((_) => setActive(false), 3000);
            return (_) => clearTimeout(r);
        }
    }, [loading]);

    return (
        <Notification
            overlay
            active={active}
            loading={loading}
            message={data ? 'Email verified' : 'Verifying email'}
        >
            {error && <ErrorMessageApollo error={error} />}
        </Notification>
    );
};

export default EmailVerifier;
