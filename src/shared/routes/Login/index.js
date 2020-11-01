import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, Redirect } from 'react-router-dom';
import { useHistory, useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useQuery } from '@apollo/client';
import { CardSimple, Col, Container, Hr, LinkButton, Row, TeritaryButton } from 'components/Blocks';
import { HeaderTitle, PageTitle, Title, TitleClean } from 'components/Text';
import Login from 'components/common/Login';
import Menu from 'components/Navigation';
import Footer from 'components/common/Footer';

const LoginPage = () => {
    const history = useHistory();
    const { search } = useLocation();
    const queries = queryString.parse(search);
    const { redirect } = queries;

    const redirectTo = redirect || '/';

    const redirectToLastLocation = () => {
        history.replace(redirectTo);
    };

    const metaTitle = 'Login · Cueup';

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />

                <meta
                    name="apple-itunes-app"
                    content="app-id=1458267647, app-argument=userProfile"
                />
            </Helmet>
            <Menu dark relative hideLogin />

            <Container>
                <Hr style={{ marginBottom: 60 }} />
                <Col middle style={{ minHeight: 'calc(100vh - 120px)' }}>
                    <CardSimple shadow style={{ padding: '2em', maxWidth: 550 }}>
                        <h1 style={{ textAlign: 'center', fontSize: 16 }}>Login</h1>
                        <Login redirect={false} onLogin={redirectToLastLocation} />
                    </CardSimple>
                    <NavLink to="/signup">
                        <TeritaryButton style={{ marginTop: 24 }}>Sign up as DJ</TeritaryButton>
                    </NavLink>
                </Col>
            </Container>
            <Footer noPreFooter />
        </>
    );
};

export default LoginPage;
