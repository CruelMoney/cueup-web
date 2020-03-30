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
import App from '../../shared/App';
import Html from '../components/HTML';

const serverRenderer = () => async (req, res) => {
    const sheet = new ServerStyleSheet();

    // these can be used to pass values to and from client code
    const routerContext = {};
    const helmetContext = {};

    const Content = (
        <I18nextProvider i18n={req.i18n}>
            <ApolloProvider client={res.locals.apolloClient}>
                <ChunkExtractorManager extractor={res.locals.chunkExtractor}>
                    <StyleSheetManager sheet={sheet.instance}>
                        <StaticRouter location={req.url} context={routerContext}>
                            <HelmetProvider context={helmetContext}>
                                <App />
                            </HelmetProvider>
                        </StaticRouter>
                    </StyleSheetManager>
                </ChunkExtractorManager>
            </ApolloProvider>
        </I18nextProvider>
    );

    let content = null;

    let apolloState = {};
    try {
        content = await renderToStringWithData(Content);
        apolloState = res.locals.apolloClient.extract();
    } catch (error) {
        console.log({ error });
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
            apolloState={JSON.stringify(apolloState).replace(/</g, '\\u003c')}
            styleTags={[...styleTags, ...cssTags]}
            scriptTags={[...scriptTags, ...linkTags]}
            i18nState={i18nState}
        >
            {content}
        </Html>
    );
    console.log('sending');

    return res.send('<!doctype html>' + html);
};

export default serverRenderer;
