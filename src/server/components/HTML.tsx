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
            <script
                async
                type="text/javascript"
                src="https://www.google-analytics.com/analytics.js"
            />
            <script async type="text/javascript" src="/autotrack.js" />
            <script id="stripe-js" src="https://js.stripe.com/v3/" async />

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

            <script
                defer
                // eslint-disable-next-line react/no-danger
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: `
                    ;(function(o,l,a,r,k,y){if(o.olark)return; r="script";y=l.createElement(r);r=l.getElementsByTagName(r)[0]; y.async=1;y.src="//"+a;r.parentNode.insertBefore(y,r); y=o.olark=function(){k.s.push(arguments);k.t.push(+new Date)}; y.extend=function(i,j){y("extend",i,j)}; y.identify=function(i){y("identify",k.i=i)}; y.configure=function(i,j){y("configure",i,j);k.c[i]=j}; k=y._={s:[],t:[+new Date],c:{},l:a}; })(window,document,"static.olark.com/jsclient/loader.js");
                  
                    /* custom configuration goes here (www.olark.com/documentation) */
                    olark.identify('8095-537-10-2169');
                `,
                }}
            />
        </body>
    </html>
);

export default HTML;
