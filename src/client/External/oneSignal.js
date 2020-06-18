window.OneSignal = window.OneSignal || [];

window.OneSignal.push(() => {
    window.OneSignal.init({
        appId: window.__ENVIRONMENT__.ONE_SIGNAL_KEY,
        autoResubscribe: true,
        notifyButton: {
            enable: false,
        },
        welcomeNotification: {
            disable: true,
        },
        allowLocalhostAsSecureOrigin: true,
    });
});

export const loadOneSignal = () => {
    const tag = document.createElement('script');
    tag.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
    document.getElementsByTagName('head')[0].appendChild(tag);
};
