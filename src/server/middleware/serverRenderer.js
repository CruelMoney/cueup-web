import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { renderToStringWithData } from '@apollo/react-ssr';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { ChunkExtractorManager } from '@loadable/server';
import { ApolloProvider } from 'react-apollo';
import { I18nextProvider } from 'react-i18next';
import App from '../../shared/App';
import Html from '../components/HTML';

const serverRenderer = () => async (req, res) => {
    const sheet = new ServerStyleSheet();

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
        content = renderToString(Content);
    }

    const styleTags = sheet.getStyleElement();
    sheet.seal();

    const scriptTags = res.locals.chunkExtractor.getScriptElements();
    const linkTags = res.locals.chunkExtractor.getLinkElements();
    const cssTags = res.locals.chunkExtractor.getStyleElements();

    let i18nState = { store: {}, initialLanguage: req.i18n.language };
    req.i18n.languages.forEach((l) => {
        i18nState.store[l] = req.i18n.services.resourceStore.data[l];
    });
    i18nState = JSON.stringify(i18nState).replace(/</g, '\\u003c');
    console.log(i18nState);

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
