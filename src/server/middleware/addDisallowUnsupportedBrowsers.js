const browserVersionIsValid = ({ isIE, isEdge, version }) => {
    console.log({ isEdge, isIE, version });
    if (isIE) {
        return false;
    }

    if (isEdge) {
        try {
            const parsedVersion = parseInt(version.split('.')[0]);
            if (parsedVersion < 19) {
                return false;
            }
        } catch (error) {
            return true;
        }
    }

    return true;
};

export const addDisallowUnsupportedBrowsers = (app) => {
    app.use((req, res, next) => {
        // check useragent
        if (!browserVersionIsValid(req.useragent)) {
            return res
                .status(200)
                .send(
                    'Your internet browser is not supported. Please use a newer browser like Chrome, Safari or Firefox.'
                );
        }

        next();
    });
};
