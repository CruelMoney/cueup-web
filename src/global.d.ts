declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PUBLIC_URL: string;
        STRIPE_PUBLIC_KEY: ?string;
        CALLBACK_DOMAIN: ?string;
        GQL_DOMAIN: ?string;
        CHAT_DOMAIN: ?string;
        FACEBOOK_ID: ?string;
        PIXEL_ID: ?string;
        GOOGLE_API_KEY: ?string;
        XENDIT_PUB_KEY: ?string;
        WEBSITE_URL: ?string;
        SETTINGS: ?('staging' | 'development' | 'production' | 'test');
    }
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module '*.module.css' {
    const css: { [key: string]: string };
    export default css;
}

declare module '*.css' {
    export default any;
}

declare const __BROWSER__: boolean;
declare const __SERVER__: boolean;

export interface Environment extends ProcessEnv {}

interface CustomWindow extends Window {
    browserHistory: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    __ENVIRONMENT__: Environment;
    __I18N_STATE__: any;
    google: any;
}

declare module 'express-manifest-helpers';
