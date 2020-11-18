import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Route } from 'react-router';
import { useMutation } from '@apollo/client';
import { useSpring, animated } from 'react-spring';
import loadable from '@loadable/component';
import { useServerContext } from 'components/hooks/useServerContext';
import useGenerateName, { TYPES } from './useGenerateName';
import DraggableList from './DragableList';
import ToggleSwitch from './ToggleSwitch';
import Button from './Button';
import Logo from './Logo';
import AnimatedText from './AnimatedName';
import Sharing from './Sharing';
import ContinueButton from './ContinueButton';
import ShowOptionsButton from './ShowOptionsButton';
import TextInput from './TextInput';
import './index.css';
import Counter from './Counter';
import { NAME_GENERATED } from './gql';
import RefreshButton, { RefreshButtonNaked } from './RefreshButton';
import InstagramWidget from './InstagramWidget';

const LazySignup = loadable(() => import('./Signup'));

const description =
    "Are you even a real DJ if you don't have a name? Find your next DJ name by clicking generate. Toggle the categories to customize the name, best to only use 2 at a time, unless you like it wild. There's 19 billion possibilities - how much time do you have to waste?";

const CATEGORIES = [
    {
        key: TYPES.ADJECTIVES,
        label: 'Spicyness',
        description: 'Spice up the name with an adjective.',
    },
    {
        key: TYPES.HIPHOP,
        label: "HipHop'ify",
        description: 'Are you the realest DJ in the hood?',
    },
    {
        key: TYPES.NAME,
        label: 'Your name',
        description: 'Include your own name.',
    },
    {
        key: TYPES.ARTISTS,
        label: 'Fame',
        description: 'Steal parts of your name from a celebrity.',
    },
];

function App({ match, history }) {
    const [mutate] = useMutation(NAME_GENERATED);

    const [categories, setCategories] = useState([
        { type: TYPES.ADJECTIVES, enabled: true, order: 0 },
        { type: TYPES.HIPHOP, enabled: true, order: 1 },
        { type: TYPES.NAME, enabled: false, order: 2 },
        { type: TYPES.ARTISTS, enabled: false, order: 3 },
    ]);
    const [alliterate, setAlliterate] = useState(true);
    const mounted = useRef(false);

    const [nameText, setName] = useState();
    const categoryKeys = categories
        .filter((c) => c.enabled)
        .sort((a, b) => a.order - b.order)
        .map((c) => c.type);
    const [hasGenerated, setGenerated] = useState(false);
    const [hasAnimated, setAnimated] = useState(false);

    const [generate, { name, refreshCategory }] = useGenerateName({
        categories: categoryKeys,
        sameFirst: alliterate,
        nameText,
    });

    useEffect(() => {
        if (hasGenerated) {
            mutate({ variables: { name } });
        }
    }, [name, mutate, hasGenerated]);

    const innerGenerate = useCallback(() => {
        setGenerated(true);
        generate();
    }, [generate]);

    const clickHandler = () => {
        setSidebar(false);
        innerGenerate();
    };

    // generate new if changing options
    useEffect(() => {
        if (mounted.current) {
            innerGenerate();
        } else {
            mounted.current = true;
        }
    }, [alliterate, nameText, innerGenerate]);

    const toggleCategory = (key, checked) => {
        if (checked) {
            setCategories((cc) => cc.map((c) => (c.type === key ? { ...c, enabled: true } : c)));
        } else {
            setCategories((cc) => cc.map((c) => (c.type === key ? { ...c, enabled: false } : c)));
        }
    };

    const onOrderChanged = (res) => {
        const withOrder = categories.map((c, idx) => ({ ...c, order: res.indexOf(idx) }));
        setCategories(withOrder);
    };

    const [sidebarActive, setSidebar] = useState(false);

    const appStyle = useSpring({
        transform: sidebarActive ? 'translateX(50%)' : 'translateX(0%)',
    });

    const onRefreshCategory = (c) => {
        refreshCategory(c);
        setSidebar(false);
    };

    return (
        <>
            <animated.div className="app" style={appStyle}>
                <div className="left-area card">
                    <div className="instructions">
                        <h2>Instructions</h2>
                        <p>{description}</p>
                    </div>

                    <div style={{ flex: 1 }} />
                    <div>
                        <DraggableList
                            onOrderChanged={onOrderChanged}
                            items={CATEGORIES.map((c) => {
                                const enabled = categories.find((el) => el.type === c.key)?.enabled;
                                return {
                                    enabled,
                                    Component: (
                                        <Category
                                            c={c}
                                            hasGenerated={hasGenerated}
                                            enabled={enabled}
                                            toggleCategory={toggleCategory}
                                            refreshCategory={onRefreshCategory}
                                            setName={setName}
                                        />
                                    ),
                                };
                            })}
                        />
                        <div className="options">
                            <ToggleSwitch
                                checked={alliterate}
                                onChange={(e) => setAlliterate(e.target.checked)}
                                name="first-letter"
                                label="Start with same letter for each word"
                            />
                        </div>
                    </div>
                    <div style={{ flex: 2 }} />
                    <Button onClick={clickHandler} disabled={!categories.some((c) => c.enabled)}>
                        Generate
                    </Button>
                </div>
                <div className="right-area">
                    <div className="menu">
                        <Counter />
                        <Sharing
                            url={`/dj-name-generator${
                                hasGenerated ? '?name=' + encodeURIComponent(name) : ''
                            }`}
                        />
                    </div>

                    <div
                        className={'dj-name-wrapper' + (hasGenerated ? ' active' : '')}
                        onClick={() => hasGenerated && history.push(match.url + '/signup')}
                        onMouseEnter={() => LazySignup.preload()}
                    >
                        <h1 className="dj-name">
                            <AnimatedText content={name} onAnimated={setAnimated} />
                        </h1>
                        <div className="actions">
                            <Sharing url={`/dj-name-generator?name=${encodeURIComponent(name)}`} />
                            <ContinueButton show={hasGenerated && hasAnimated}>
                                Become DJ
                            </ContinueButton>
                        </div>
                    </div>
                </div>

                <div className="bottom-right">
                    <a href={'https://cueup.io/become-dj?ref=dj-name-generator'}>
                        <div className="created-by">
                            <h4>Created by</h4>
                            <Logo />
                        </div>
                    </a>

                    <InstagramWidget />
                </div>

                <div className={'mobile-action-buttons mobile-only '}>
                    {!hasGenerated && (
                        <Button
                            onClick={() => setSidebar(true)}
                            className="show-options-button-first"
                        >
                            Start
                        </Button>
                    )}
                    {hasGenerated && <ShowOptionsButton onClick={() => setSidebar(true)} />}
                    {hasGenerated && <RefreshButton onClick={() => innerGenerate()} />}
                </div>
            </animated.div>

            <Route
                path={match.url + '/signup'}
                render={(props) => <LazySignup name={name} {...props} />}
            />
        </>
    );
}

const Category = ({ enabled, c, toggleCategory, setName, hasGenerated, refreshCategory }) => {
    const withInput = c.key === TYPES.NAME;

    return (
        <div key={c.key} className={'category-content'}>
            {withInput && enabled ? <TextInput onSave={setName} /> : <h4>{c.label}</h4>}
            <div className="row">
                <ToggleSwitch
                    checked={enabled}
                    small
                    onChange={(e) => toggleCategory(c.key, e.target.checked)}
                    name={'toggle-' + c.key}
                />
                <p>{c.description}</p>
            </div>
            {hasGenerated && !withInput && enabled && (
                <RefreshButtonNaked onClick={() => refreshCategory(c.key)} />
            )}
        </div>
    );
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const AppWithMeta = (props) => {
    const params = useQuery();
    const location = useLocation();
    const name = params.get('name');
    const { environment } = useServerContext();
    const title = 'DJ Name Generator | Cueup';
    const thumb =
        environment.WEBSITE_URL +
        '/sharing-previews/dj-name-generator/' +
        (name ? encodeURIComponent(name) : '');

    const pageURL = environment.WEBSITE_URL + location.pathname + location.search;

    return (
        <>
            <Helmet>
                <link
                    rel="preload"
                    href="/static/assets/HANGTHEDJ.ttf"
                    as="font"
                    crossOrigin="anonymous"
                />
                <title>{title}</title>

                <meta name="description" content={description} />
                <meta name="keywords" content="dj name generator" />

                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={thumb} />
                <meta property="og:image:height" content={'630'} />
                <meta property="og:image:width" content={'1200'} />
                <meta property="og:url" content={pageURL} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@@CueupDK" />
                <meta name="twitter:creator" content="@@CueupDK" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={thumb} />
                <meta name="twitter:url" content={pageURL} />
            </Helmet>

            <App {...props} />
        </>
    );
};

export default AppWithMeta;
