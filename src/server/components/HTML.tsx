import React from 'react';
import jsesc from 'jsesc';

type Props = {
    children: any;
    helmetContext: any;
    apolloState: any;
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

    const apolloString = jsesc(JSON.stringify(apolloState), {
        json: true,
        isScriptContext: true,
    });
    const environmentString = jsesc(JSON.stringify(environment), {
        json: true,
        isScriptContext: true,
    });
    const i18nString = jsesc(JSON.stringify(i18nState), {
        json: true,
        isScriptContext: true,
    });

    return (
        <html {...htmlAttrs}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
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

                {helmet.title.toComponent()}
                {helmet.meta.toComponent()}
                {helmet.base.toComponent()}
                {helmet.link.toComponent()}
                {helmet.script.toComponent()}
                {styleTags.filter(Boolean).map((tag) => tag)}
                <script
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        // jsesc/stringify here
                        // see: https://twitter.com/HenrikJoreteg/status/1143953338284703744
                        __html: `
                    window.__APOLLO_STATE__ = JSON.parse(${apolloString});
                    window.__I18N_STATE__ = JSON.parse(${i18nString});
                    window.__ENVIRONMENT__ =  JSON.parse(${environmentString});
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
