import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { renderToStringWithData } from '@apollo/react-ssr';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { ChunkExtractorManager } from '@loadable/server';
import { ApolloProvider } from 'react-apollo';
import { I18nextProvider } from 'react-i18next';
import { languagesArray } from 'constants/locales/languages';
import { ServerContextProvider } from 'components/hooks/useServerContext';
import { Environment } from 'global';
import App from '../../shared';
import Html from '../components/HTML';

const production = process.env.NODE_ENV === 'production';

const environment: Environment = {
    WEBSITE_URL: process.env.WEBSITE_URL!,
    STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUB_KEY!,
    CALLBACK_DOMAIN: process.env.REACT_APP_CUEUP_CALLBACK_DOMAIN!,
    GQL_DOMAIN: process.env.REACT_APP_CUEUP_GQL_DOMAIN!,
    CHAT_DOMAIN: process.env.REACT_APP_CUEUP_CHAT_DOMAIN!,
    FACEBOOK_ID: process.env.REACT_APP_CUEUP_FB_ID!,
    PIXEL_ID: '1461498583979582',
    XENDIT_PUB_KEY: process.env.REACT_APP_XENDIT_PUB_KEY!,
    GOOGLE_API_KEY: production
        ? 'AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ'
        : 'AIzaSyDYsMT5dhTnBLMcAetq4NGVWUyijkrVSHs',
    SETTING: process.env.SETTING || 'development',
    ONE_SIGNAL_KEY: process.env.REACT_APP_ONE_SIGNAL_APP_ID!,
};

const serverRenderer = () => async (req, res) => {
    const sheet = new ServerStyleSheet();

    // these can be used to pass values to and from client code
    const routerContext = {};
    const helmetContext = {};

    const Content = (
        <StaticRouter location={req.url} context={routerContext}>
            <ServerContextProvider environment={environment} isSSR={true}>
                <I18nextProvider i18n={req.i18n}>
                    <ApolloProvider client={res.locals.apolloClient}>
                        <ChunkExtractorManager extractor={res.locals.chunkExtractor}>
                            <StyleSheetManager sheet={sheet.instance}>
                                <HelmetProvider context={helmetContext}>
                                    <App />
                                </HelmetProvider>
                            </StyleSheetManager>
                        </ChunkExtractorManager>
                    </ApolloProvider>
                </I18nextProvider>
            </ServerContextProvider>
        </StaticRouter>
    );

    let content = '';

    let apolloState = {};
    try {
        content = await renderToStringWithData(Content);
        apolloState = res.locals.apolloClient.extract();
    } catch (error) {
        console.log({ error });
        content = renderToString(Content);
    }

    const styleTags = sheet.getStyleElement();
    sheet.seal();

    const scriptTags = res.locals.chunkExtractor.getScriptElements();
    const linkTags = res.locals.chunkExtractor.getLinkElements();
    const cssTags = res.locals.chunkExtractor.getStyleElements();

    const initialLanguage = req.i18n.language;
    const i18nState = {
        store: {},
        initialLanguage,
    };

    // include all routes
    for (const lng of languagesArray) {
        i18nState.store[lng] = {
            routes: req.i18n.getResourceBundle(lng, 'routes'),
        };
    }

    // find and add the used namespaces for this request
    const namespaces = req.i18n.reportNamespaces.getUsedNamespaces();

    for (const ns of namespaces) {
        i18nState.store[i18nState.initialLanguage][ns] = req.i18n.getResourceBundle(
            i18nState.initialLanguage,
            ns
        );
    }

    const html = renderToString(
        <Html
            helmetContext={helmetContext}
            apolloState={apolloState}
            styleTags={[...styleTags, ...cssTags]}
            scriptTags={[...scriptTags, ...linkTags]}
            i18nState={i18nState}
            environment={environment}
        >
            {content}
        </Html>
    );

    return res.send('<!doctype html>' + html);
};

export default serverRenderer;
