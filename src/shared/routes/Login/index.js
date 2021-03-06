import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, Redirect } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';
import { useQuery } from '@apollo/client';
import { Col, Container, TeritaryButton } from 'components/Blocks';
import Login from 'components/common/Login';
import { ME } from 'components/gql';
import GreyBox from 'components/GreyBox';
import Logo from 'components/common/Logo';

const LoginPage = () => {
    const { data, loading } = useQuery(ME);
    const history = useHistory();
    const { search } = useLocation();
    const queries = queryString.parse(search);
    const { redirect } = queries;
    const redirectTo = redirect || '/user';

    const redirectToLastLocation = useCallback(() => {
        history.replace(redirectTo);
    }, [history, redirectTo]);

    // redirect if already logged in
    if (!loading && data?.me) {
        return <Redirect to={redirectTo} />;
    }

    const metaTitle = 'Login · Cueup';

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />
            </Helmet>

            <Container>
                <Col middle center style={{ minHeight: 'calc(100vh - 120px)' }}>
                    <NavLink to={'/'} style={{ marginTop: 30 }}>
                        <Logo dark />
                    </NavLink>
                    <h1 style={{ textAlign: 'center', fontSize: 18, marginTop: 15 }}>
                        Log in to Cueup
                    </h1>

                    <GreyBox style={{ padding: '2em', paddingBottom: 0, maxWidth: 550 }}>
                        <Login redirect={false} onLogin={redirectToLastLocation} />
                    </GreyBox>
                    <NavLink to="/signup">
                        <TeritaryButton>Sign up as DJ</TeritaryButton>
                    </NavLink>
                </Col>
            </Container>
        </>
    );
};

export default LoginPage;
