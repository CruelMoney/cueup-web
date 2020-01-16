import React from 'react';

type Props = {
    children: any;
    helmetContext: any;
    scripts: string[];
    state: string;
    apolloState: string;
    headerChildren: any;
    styleTags: any[];
    scriptTags: any[];
};

const HTML = ({
    children,
    styleTags = [],
    scriptTags = [],
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
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-59876038-4" />

            <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async />
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: `
                    var OneSignal = window.OneSignal || [];
                    OneSignal.push(function() {
                        OneSignal.init({
                        appId: "${process.env.REACT_APP_ONE_SIGNAL_APP_ID}",
                        autoResubscribe: true,
                        notifyButton: {
                            enable: false,
                        },
                        welcomeNotification: {
                            disable: true
                        },
                        allowLocalhostAsSecureOrigin: true,

                        });
                    });
                `,
                }}
            />

            {helmet.base.toComponent()}
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
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
            {scriptTags.filter(Boolean).map((tag) => tag)}

            <div id="tooltip-portal" />
            <div id="mobile-menu-portal" />
            <div id="notification-portal" />
        </body>
    </html>
);

export default HTML;
