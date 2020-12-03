const getExtensionError = (err) => {
    const { extensions } = err;

    if (!extensions) {
        return null;
    }
    const errors = extensions.exception?.errors;
    if (!errors) {
        return null;
    }
    const firstError = Object.values(errors)[0];
    return firstError?.message;
};

export const getErrorMessage = (error) => {
    let msgs = 'There was an error';

    if (!error) {
        return null;
    }
    if (typeof error === 'string') {
        msgs = error;
    }

    const { graphQLErrors, networkError } = error;

    if (error.message) {
        msgs = error.message;
    }

    console.log({ error, networkError, graphQLErrors });

    if (networkError?.result?.errors?.length) {
        networkError.result.errors.map((e) => {
            msgs = e.message;
        });
    }

    if (graphQLErrors && graphQLErrors.length > 0) {
        graphQLErrors.map((e) => {
            msgs = e.message;
            const extError = getExtensionError(e);
            if (extError) {
                msgs = extError;
            }
        });
    }

    return msgs;
};
