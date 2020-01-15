const getTranslatedURL = (url, code, translate) => {
    url = url
        .split('/')
        .filter((p) => p !== '')
        .map((p) => {
            const transP = translate('routes.' + p);
            return transP.includes('routes.') ? p : transP;
        });

    url = ['', ...url];

    return url.join('/');
};

export { getTranslatedURL };
