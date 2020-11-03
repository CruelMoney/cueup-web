import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import Footer from 'components/common/Footer';
import Menu from 'components/Navigation';
import { Container, PrimaryButton, SecondaryButton, SecondaryButtonLink } from 'components/Blocks';
import { Body } from 'components/Text';
import DjSearch from 'routes/Home/components/DJSearch';
import { BreadCrumbs } from 'routes/BookDJ/Components';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { SEARCH_DEEP } from 'routes/BookDJ/gql';
import { useServerContext } from 'components/hooks/useServerContext';
import { DJSearchEntry } from 'routes/BookDJ/SearchResults';
import Occasions from 'routes/BookDJ/Occassions';
import { ScrollToTopOnMount } from 'components/common/ScrollToTop';
import PopularRequests from 'routes/BookDJ/PopularRequests';

// title: Best DJs Near Me (23+ found)

// h1: Find a DJ near you
// description: Check prices from all DJs near you. Find and book a DJ that matches your requirements.

// h2: Best DJs near you

// breadcrumbs: DJs Near Me

// dj list

// see more -> search results

// QA:

// occasions

// popular requests

const DJsNearMePage = ({ topDjs, loading }) => {
    const { translate } = useTranslate();
    const history = useHistory();

    const metaTitle = 'Best DJs Near Me (23+ found)';
    const title = 'Find a DJ near you';
    const description =
        'Check prices from all DJs near you. Find and book a DJ that matches your requirements.';

    const breadCrumbs = [
        {
            url: translate(appRoutes.home),
            label: 'Home',
        },

        {
            url: translate(appRoutes.search),
            label: 'DJs Near Me',
        },
        {
            url: translate(appRoutes.djsNearMe),
            label: 'DJs',
        },
    ];

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />

                <meta name="description" content={description} />
                <meta name="twitter:description" content={description} />
                <meta property="og:description" content={description} />
            </Helmet>
            <ScrollToTopOnMount />
            <Menu />
            <HeroContainer>
                <Container>
                    <Title>{title}</Title>
                    <LandingBody white>{description} </LandingBody>
                    <SearchWrapper>
                        <DjSearch />
                    </SearchWrapper>
                </Container>
            </HeroContainer>
            <Container style={{ maxWidth: 1000 }}>
                <h2>Best DJs near you</h2>
                <BreadCrumbs items={breadCrumbs} />

                <SearchList>
                    {topDjs.map((dj, idx) => (
                        <DJSearchEntry idx={idx} key={dj?.id || idx} {...dj} loading={loading} />
                    ))}
                </SearchList>

                <SecondaryButton style={{ margin: 'auto' }}>
                    <NavLink to={translate(appRoutes.search)}>See more DJs</NavLink>
                </SecondaryButton>
            </Container>

            <div style={{ marginTop: 60 }}>
                <Occasions
                    onClick={(state) => () =>
                        history.push({ pathname: translate(appRoutes.search), state })}
                />
            </div>
            <PopularRequests activeLocation={{ name: 'near me' }} onClick={() => {}} />
            <Footer
                bgColor="#fff"
                firstTo={'/book-dj'}
                firstLabel={'Post event'}
                title={'Tired of searching? Post your event.'}
                subTitle={'Let us find the DJs and send you their best prices.'}
            />
        </>
    );
};

const SearchList = styled.ul`
    padding: 0;
    list-style: none;
    > li {
    }
`;

const HeroContainer = styled.section`
    background: radial-gradient(114.62% 129.84% at 45.24% 67.36%, #122b48 0%, #000000 100%);
    display: flex;
    align-items: center;
    width: 100%;
    color: #fff;
    position: relative;
    padding: 100px 0 60px 0;
    margin-bottom: 60px;
`;

const Title = styled.h1`
    line-height: 1.3em;
    text-align: center;
    /* @media only screen and (max-width: 1024px) {
        font-size: 0.35em;
    }
    @media only screen and (max-width: 480px) {
        font-size: 0.3em;
    } */
`;

const LandingBody = styled(Body)`
    line-height: 1.5em;
    color: #fff;
    text-align: center;
    margin: auto;
    max-width: 450px;
`;

const SearchWrapper = styled.div`
    max-width: 600px;
    margin: auto;
    font-size: 120px;
`;

const DataWrapper = () => {
    const { data } = useServerContext();

    const filter = {
        countryCode: data?.topCities[0]?.iso2,
    };

    const { data: searchData, loading } = useQuery(SEARCH_DEEP, {
        fetchPolicy: 'cache-first',
        skip: !filter.countryCode,
        variables: {
            filter,
            pagination: {
                orderBy: 'UPDATED_AT_DESCENDING',
                limit: 10,
                page: 1,
            },
        },
    });
    const topDjs = searchData?.searchDjs?.edges || [];

    return <DJsNearMePage topDjs={topDjs} loading={loading} />;
};

export default DataWrapper;
