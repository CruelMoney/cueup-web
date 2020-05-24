export const loadGoogleAnalytics = () => {
    const tag = document.createElement('script');
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=UA-59876038-4';
    document.getElementsByTagName('head')[0].appendChild(tag);
};
