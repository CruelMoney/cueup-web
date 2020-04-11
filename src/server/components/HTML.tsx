import React from 'react';

type Props = {
    children: any;
    helmetContext: any;
    apolloState: string;
    styleTags: any[];
    scriptTags: any[];
    i18nState: any;
    environment: any;
};

const HTML = ({
    children,
    styleTags = [],
    scriptTags = [],
    apolloState,
    helmetContext: { helmet },
    i18nState,
    environment,
}: Props) => {
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
        <html {...htmlAttrs}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
                />
                {helmet.title.toComponent()}
                {helmet.meta.toComponent()}
                {helmet.base.toComponent()}
                {helmet.link.toComponent()}
                {helmet.script.toComponent()}
                {styleTags.filter(Boolean).map((tag) => tag)}
                <script
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        // TODO: Add jsesc/stringify here
                        // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
                        __html: `
                    window.__APOLLO_STATE__ = ${apolloState};
                    window.__I18N_STATE__ = ${JSON.stringify(i18nState).replace(/</g, '\\u003c')};
                    window.__ENVIRONMENT__ = ${JSON.stringify(environment).replace(
                        /</g,
                        '\\u003c'
                    )};
                    `,
                    }}
                />
            </head>
            <body {...bodyAttrs}>
                {/* eslint-disable-next-line react/no-danger */}
                <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
                {scriptTags.filter(Boolean).map((tag) => tag)}

                <div id="tooltip-portal" />
                <div id="mobile-menu-portal" />
                <div id="notification-portal" />
                <div id="portal" />
                <div id="player-portal" />
            </body>
        </html>
    );
};

export default HTML;
