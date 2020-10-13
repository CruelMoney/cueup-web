import * as React from 'react';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { ChunkExtractorManager } from '@loadable/server';
import { ApolloProvider } from '@apollo/client';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { I18nextProvider } from 'react-i18next';
import { CookiesProvider } from 'react-cookie';
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
    COUNTRY_CODE: null,
};

const serverRenderer = () => async (req, res) => {
    const sheet = new ServerStyleSheet();

    environment.COUNTRY_CODE = req.header('cf-ipcountry');

    // these can be used to pass values to and from client code
    const routerContext = {
        request: req,
        response: res,
    } as any;
    const helmetContext = {};
    const clientData = {
        topCities: res.locals.top_cities,
        countries: res.locals.countries,
        activeLocation: res.locals.activeLocation,
    };

    const Content = (
        <CookiesProvider cookies={req.universalCookies}>
            <StaticRouter location={req.url} context={routerContext}>
                <ServerContextProvider environment={environment} data={clientData} isSSR={true}>
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
        </CookiesProvider>
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

    if (routerContext.url) {
        res.writeHead(302, {
            Location: routerContext.url,
        });
        res.end();
        return;
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

    // we serve a static site to crawlers to improve performance
    const staticOnly = req.useragent.isBot;

    res.setHeader('Content-Type', 'text/html');
    res.write(Buffer.from('<!DOCTYPE html>', 'utf8'));

    return renderToNodeStream(
        <Html
            helmetContext={helmetContext}
            styleTags={[...styleTags, ...cssTags]}
            scriptTags={staticOnly ? [] : [...scriptTags, ...linkTags]}
            i18nState={staticOnly ? {} : i18nState}
            environment={staticOnly ? {} : environment}
            clientData={staticOnly ? {} : clientData}
            apolloState={staticOnly ? {} : apolloState}
        >
            {content}
        </Html>
    ).pipe(res);
};

export default serverRenderer;
