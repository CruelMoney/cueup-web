import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import Footer from 'components/common/Footer';
import Menu from 'components/Navigation';
import { Container, PrimaryButton, SecondaryButton, SecondaryButtonLink } from 'components/Blocks';
import { Body, H2 } from 'components/Text';
import DjSearch from 'routes/Home/components/DJSearch';
import { BreadCrumbs, GreyBox } from 'routes/BookDJ/Components';
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

const DJsNearMePage = ({ topDjs, loading, totalFound }) => {
    const { translate } = useTranslate();
    const history = useHistory();

    const metaTitle = `Best DJs Near Me (${totalFound}+ found)`;
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

                <SearchList style={{ marginTop: 30 }}>
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
            {/* <Container style={{ marginBottom: 60 }}>
                <FaqSection />
            </Container> */}
            <PopularRequests
                title="Popular requests for DJs near you"
                activeLocation={{ name: 'near me' }}
                onClick={(state) => () =>
                    history.push({ pathname: translate(appRoutes.search), state })}
            />
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

const FaqSection = () => {
    return (
        <>
            <H2 small>FAQ</H2>
            <GreyBox>
                <h3>How do I find a cheap DJ?</h3>
                <Body>
                    To find a cheap or affordable DJ for your party or wedding, search for local DJs
                    near you and ask for free cost estimates from several of them. While some DJ
                    profiles may provide an automatically generated starting cost, it’s important to
                    contact the DJ to get an idea of how much your particular request will cost.
                    This also gives you the opportunity to ask them other important questions and
                    make sure you are a good fit.
                </Body>
            </GreyBox>
            <GreyBox>
                <h3>How much is a DJ?</h3>
                <Body>
                    When you hire a local DJ, expect to pay roughly between $300 and $800. But be
                    aware that the actual price will vary based on several factors, including the
                    length of the DJ’s set and how much of a presence they need to be. Larger venues
                    can drive up the cost, as this requires more equipment, soundchecking and setup.
                    Adding extras like confetti, fog, light shows and black lights also adds to the
                    cost. Get cost estimates from the best DJs near you to find out how much you
                    should expect to spend for your event. Read our cost guide, “How much does a DJ
                    cost?”
                </Body>
            </GreyBox>
            <GreyBox>
                <h3>How do you book a DJ for a party?</h3>
                <Body>
                    To book a party DJ, start by comparing local pros in your area. Check out their
                    ratings and reviews to find out: Are they professional? Do they show up on time
                    to set up for the party? Do they know how to feel the energy in the room and
                    adjust the music accordingly? Are they friendly to guests and take song
                    requests? Do they specialize in the genres you want (pop, Top 40, hip-hop,
                    etc.)? Do they have experience playing at your type of event (weddings, birthday
                    parties, etc.)? Whenever possible, watch videos of their performances. Your last
                    step is to contact three to five different DJs near you to ask them questions
                    and get price quotes.
                </Body>
            </GreyBox>
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

    const [totalFound, setTotalFound] = useState(23);

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

    useEffect(() => {
        if (searchData?.searchDjs) {
            setTotalFound(searchData?.searchDjs?.pageInfo?.totalDocs);
        }
    }, [searchData]);

    return <DJsNearMePage topDjs={topDjs} loading={loading} totalFound={totalFound} />;
};

export default DataWrapper;
