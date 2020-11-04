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
import ScrollToTop from 'components/common/ScrollToTop';
import PopularRequests from 'routes/BookDJ/PopularRequests';
import { DJS_IN_LOCATION } from './gql';

const DJsNearMePage = ({ topDjs, loading, totalFound }) => {
    const { translate } = useTranslate();
    const history = useHistory();

    const metaTitle = `Best DJs Near Me (${totalFound}+ found)`;
    const title = 'Find a DJ near you';
    const description =
        'Check prices from all DJs near you. See their photos and reviews, and listen to mixtapes. Contact the local DJs you like.';

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

    if (loading) {
        topDjs = [null, null, null, null, null, null, null, null, null];
    }

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
            <ScrollToTop />
            <Menu />
            <HeroContainer id="top">
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
            <Container style={{ marginBottom: 60 }}>
                <FaqSection />
            </Container>
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
    const { translate } = useTranslate();
    return (
        <FaqWrapper>
            <H2 small>FAQ</H2>
            <GreyBox>
                <h3>Do I need a DJ for my event?</h3>
                <Body>
                    If you plan to have music at your event, you should book a DJ to manage the
                    music. It is a very time-consuming task to create a playlist, and it can be
                    stressful to control during the event. You have many other things to look after,
                    and hiring a DJ makes it so much easier. It is the DJ's job to set the mood and
                    manage the music, so you don't have to stress about it. {'\n'}If you don't want
                    to set a mood at your event, you probably don't need a DJ. But having
                    well-selected well-selected music throughout the event will make it a much more
                    enjoyable time for everyone. {'\n'}Many DJs have recorded performances and
                    pictures, so you can look for{' '}
                    <a href={translate(appRoutes.djsNearMe)}>DJs near you</a> that match your
                    desired atmosphere.
                </Body>
            </GreyBox>
            <GreyBox>
                <h3>How much does a DJ cost?</h3>
                <Body>
                    A DJ costs anywhere between 100 USD up to 1.500 USD, but typically around 500
                    USD for 4 hours. {'\n'}Some DJs can even be free or very affordable because they
                    just started and want to get experience. Getting a cheap DJ is a good option if
                    you don't have high expectations and will be better than managing the music
                    yourself. {'\n'}If you have specific requirements and expect the DJ to be a
                    significant part of the event, you should book a more experienced DJ. {'\n'}The
                    DJs price depends on your event's size, how many hours the DJ should perform,
                    and what equipment they need to bring. {'\n'}To find out what a DJ usually costs
                    in your area, you can get estimates and compare prices of{' '}
                    <a href={translate(appRoutes.djsNearMe)}>local DJs near you</a>.
                </Body>
            </GreyBox>
            <GreyBox>
                <h3>How do you book a DJ for a party?</h3>
                <Body>
                    Start by searching and comparing DJs in your area. You can also ask your social
                    network if anyone knows a good DJ. {'\n'}When looking for a DJ, you should
                    consider a few things:
                    <ul>
                        <li>Does the DJ usually play the genres of music you want?</li>
                        <li>How does the DJ's setup look? Messy or neat?</li>
                        <li>Does the DJ have experience with your type of event?</li>
                        <li>
                            Can the DJ provide additional services such as dinner music or MCing?
                        </li>
                        <li>
                            Does the DJ expect you to provide equipment such as speakers, mixer, and
                            decks, or will they supply the equipment?
                        </li>
                        <li>
                            What time should the DJ show up to prepare? Preferably you don't want it
                            to clash with the arrival of the guests.
                        </li>
                        <li>Do they accept song requests from your guests?</li>
                    </ul>
                    Once you know what you want, it's easier to find and contact the{' '}
                    <a href={translate(appRoutes.djsNearMe)}>best DJs near you</a>.
                </Body>
            </GreyBox>
        </FaqWrapper>
    );
};

const FaqWrapper = styled.div`
    max-width: 600px;
    margin: auto;
    h2 {
        text-align: center;
    }
    h3 {
        margin-bottom: 0.5em;
    }
    p {
        white-space: pre-wrap;
        line-height: 1.7em;
    }
    a,
    a:hover {
        text-decoration: underline;
    }
    ul {
        list-style: initial;
        padding: 0.5em 1em;
        margin: initial;
        border: none;
        li {
            padding: initial;
            margin: initial;
        }
    }
`;
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

    @media only screen and (max-width: 480px) {
        font-size: 32px;
    }
`;

const LandingBody = styled(Body)`
    line-height: 1.5em;
    color: #fff;
    text-align: center;
    margin: auto;
    max-width: 520px;
`;

const SearchWrapper = styled.div`
    max-width: 600px;
    margin: auto;
    font-size: 120px;
`;

const DataWrapper = () => {
    const { data } = useServerContext();

    const city = data?.topCities[0];
    const filter = {
        countryCode: city?.iso2,
        location: {
            latitude: parseFloat(city.lat),
            longitude: parseFloat(city.lng),
        },
    };

    const [totalFound, setTotalFound] = useState(23);

    const { data: fallbackData } = useQuery(DJS_IN_LOCATION, {
        fetchPolicy: 'cache-first',
        variables: {
            filter,
            pagination: {
                limit: 10,
                page: 1,
            },
        },
    });
    const { data: searchData, loading } = useQuery(SEARCH_DEEP, {
        fetchPolicy: 'cache-first',
        skip: !filter.countryCode,
        variables: {
            filter,
            pagination: {
                limit: 10,
                page: 1,
            },
        },
    });
    const topDjs = searchData?.searchDjs?.edges || [];
    let fallbackDjs = fallbackData?.djsInLocation?.edges || [];
    fallbackDjs = fallbackDjs
        .filter((dj) => !topDjs.some((dj2) => dj2.id === dj.id))
        .slice(0, 10 - topDjs.length);

    useEffect(() => {
        if (searchData?.searchDjs) {
            setTotalFound(searchData?.searchDjs?.pageInfo?.totalDocs);
        }
    }, [searchData]);

    return (
        <DJsNearMePage
            topDjs={[...topDjs, ...fallbackDjs]}
            loading={loading}
            totalFound={totalFound}
        />
    );
};

export default DataWrapper;
