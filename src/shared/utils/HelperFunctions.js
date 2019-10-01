const getTranslatedURL = (url, code, translate) => {
    url = url
        .split('/')
        .filter((p) => p !== '')
        .filter((p) => p !== 'dk')
        .map((p) => {
            const transP = translate('routes.' + p);
            return transP.includes('routes.') ? p : transP;
        });

    if (code === 'da') {
        url = ['', 'dk', ...url];
    } else {
        url = ['', ...url];
    }

    return url.join('/');
};

export { getTranslatedURL };
