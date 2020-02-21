import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { useTransition, animated } from 'react-spring';
import { useMeasure } from '@softbind/hook-use-measure';
import requestFormContent from '../../components/common/RequestForm/content.json';
import addTranslate from '../../components/higher-order/addTranslate';
import ScrollToTop from '../../components/common/ScrollToTop';
import Footer from '../../components/common/Footer';
import { Container, Row, Col } from '../../components/Blocks';
import content from './content.json';
import EventProgress from './components/blocks/EventProgress';
import { EVENT } from './gql.js';
import EventHeader from './components/blocks/EventHeader.js';
import Overview from './routes/Overview';
import Requirements from './routes/Requirements';
import Review from './routes/Review';

const Index = ({ translate, match, location }) => {
    const {
        params: { id, hash },
    } = match;
    const { data = {}, loading } = useQuery(EVENT, {
        skip: !id || !hash,
        variables: {
            id,
            hash,
        },
    });

    const { event: theEvent } = data;

    if (!loading && !theEvent) {
        return <Redirect to={translate('routes./not-found')} />;
    }

    const title = theEvent ? theEvent.name : 'Cueup | Event';
    const description = theEvent ? theEvent.description : null;

    if (theEvent) {
        theEvent.hash = match.params.hash;
    }

    return (
        <div>
            {theEvent && (
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />

                    <meta name="description" content={description} />
                    <meta name="twitter:description" content={description} />
                    <meta property="og:description" content={description} />
                </Helmet>
            )}

            <Content
                location={location}
                match={match}
                theEvent={theEvent}
                loading={loading}
                translate={translate}
            />

            <Footer
                noSkew
                firstTo={translate('routes./how-it-works')}
                secondTo={translate('routes./')}
                firstLabel={translate('how-it-works')}
                secondLabel={translate('arrange-event')}
                title={translate('Organizing a new event?')}
                subTitle={translate('See how it works, or arrange an event.')}
            />
        </div>
    );
};

const idxRoute = (path) => {
    if (path.includes('review')) {
        return 2;
    }
    if (path.includes('requirements')) {
        return 1;
    }
    return 0;
};

let curIdx = 0;

const getDirection = (newPath) => {
    const newIdx = idxRoute(newPath);
    let dir = 'back';
    if (newIdx > curIdx) {
        dir = 'front';
    }
    curIdx = newIdx;
    return dir;
};

const Content = React.memo((props) => {
    const { match, location, ...eventProps } = props;
    const { theEvent, loading } = eventProps;
    const [height, setHeight] = useState('auto');
    const direction = getDirection(location.pathname);
    const [ssr, setSsr] = useState(true);

    useEffect(() => {
        setSsr(false);
    }, []);

    const transitions = useTransition(location, (location) => location.pathname, {
        config: {
            tension: 500,
            friction: 40,
            precision: 0.001,
        },
        from: {
            opacity: 0,
            transform: `translateX(${direction === 'back' ? '-100px' : '100px'}`,
        },
        enter: { opacity: 1, transform: 'translateX(0px)' },
        leave: {
            opacity: 0,
            transform: `translateX(${direction === 'back' ? '100px' : '-100px'}`,
        },
    });

    return (
        <div>
            <ScrollToTop animate top={280} />

            <EventHeader theEvent={theEvent} loading={loading} pathname={match.url} />

            <Container>
                <ContainerRow>
                    <BorderCol style={{ height: height || 'auto' }}>
                        <AnimationWrapper>
                            {transitions.map(({ item, props, key }) => (
                                <SSRComponent
                                    item={item}
                                    ssr={ssr}
                                    style={props}
                                    key={key}
                                    match={match}
                                    eventProps={eventProps}
                                    registerHeight={setHeight}
                                />
                            ))}
                        </AnimationWrapper>
                    </BorderCol>
                    <Col>
                        <EventProgress theEvent={theEvent} />
                    </Col>
                </ContainerRow>
            </Container>
        </div>
    );
});

const SSRComponent = ({ ssr, ...props }) => {
    if (ssr) {
        return <GigRoutes {...props} />;
    }

    return <TransitionComponent {...props} />;
};

const GigRoutes = forwardRef((props, ref) => {
    const { style, item, match, eventProps } = props;
    return (
        <animated.div style={style} ref={ref}>
            <Switch location={item}>
                <Route
                    path={[match.path + '/overview', match.path + '/info']}
                    render={(navProps) => <Overview {...navProps} {...props} {...eventProps} />}
                />
                <Route
                    path={match.path + '/requirements'}
                    render={(navProps) => (
                        <Requirements
                            {...navProps}
                            {...props}
                            {...eventProps}
                            pathname={match.url}
                        />
                    )}
                />
                <Route
                    path={match.path + '/review'}
                    render={(navProps) => <Review {...navProps} {...props} {...eventProps} />}
                />
            </Switch>
        </animated.div>
    );
});

const TransitionComponent = ({ registerHeight, ...props }) => {
    const ref = useRef(null);
    const { bounds } = useMeasure(ref, 'bounds');

    useEffect(() => {
        if (bounds) {
            registerHeight(bounds.height);
        }
    }, [bounds, registerHeight]);

    return <GigRoutes ref={ref} {...props} />;
};

const ContainerRow = styled(Row)`
    align-items: stretch;
    padding-top: 60px;
    padding-bottom: 60px;
    @media only screen and (max-width: 768px) {
        flex-direction: column-reverse;
    }
`;

const BorderCol = styled(Col)`
    border-right: 1px solid #e9ecf0;
    padding-right: 42px;
    width: 100%;
    z-index: 0;
    @media only screen and (max-width: 768px) {
        border-right: none;
        padding-right: 0;
    }
`;

const AnimationWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    > div {
        position: absolute;
        transform-origin: center center;
        max-width: 100%;
        width: 100%;
    }
`;

export default addTranslate(Index, [content, requestFormContent]);
