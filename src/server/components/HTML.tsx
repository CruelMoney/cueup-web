import React from 'react';

type Props = {
    children: any;
    myCss: string[];
    helmetContext: any;
    scripts: string[];
    state: string;
    apolloState: string;
    headerChildren: any;
    styleTags: any[];
};

const HTML = ({
    children,
    myCss = [],
    styleTags = [],
    scripts = [],
    state = '{}',
    apolloState,
    helmetContext: { helmet },
}: Props) => (
    <html lang="">
        <head>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
            />
            <script id="stripe-js" src="https://js.stripe.com/v3/" async />
            {helmet.base.toComponent()}
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
            {helmet.script.toComponent()}
            {myCss.filter(Boolean).map((href) => (
                <link key={href} rel="stylesheet" href={href} />
            ))}
            {styleTags.filter(Boolean).map((tag) => tag)}
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    // TODO: Add jsesc/stringify here
                    // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
                    __html: `
                    window.__APOLLO_STATE__ = ${apolloState};
                    window.__PRELOADED_STATE__ = ${state};
                    `,
                }}
            />
        </head>
        <body>
            {/* eslint-disable-next-line react/no-danger */}
            <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
            {scripts.filter(Boolean).map((src) => (
                <script key={src} src={src} />
            ))}

            <div id="tooltip-portal" />
            <div id="mobile-menu-portal" />
            <div id="notification-portal" />
        </body>
    </html>
);

export default HTML;
