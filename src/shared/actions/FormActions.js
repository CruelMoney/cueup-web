import c from '../constants/constants';

const ActionTypes = c.ActionTypes;

export function updateFormValue(name, value, formName) {
    return {
        type: ActionTypes.FORM_UPDATE_VALUE,
        name,
        value,
        formName,
    };
}

export function updateFilters(filter, value, formName) {
    return {
        type: ActionTypes.FORM_UPDATE_FILTERS,
        filter,
        value,
        formName,
    };
}

export function submitRequested(formName, submitName) {
    return {
        type: ActionTypes.FORM_SUBMIT_REQUESTED,
        formName,
        submitName,
    };
}

export function resetState(formName) {
    return {
        type: ActionTypes.FORM_RESET,
        formName,
    };
}

export function handleSubmitResult(formName, err, submitName, resetStatusOnSucces = false) {
    return function (dispatch) {
        if (err) {
            dispatch(
                (function () {
                    return {
                        type: ActionTypes.FORM_SUBMIT_FAILED,
                        formName,
                        submitName,
                        err: err.message ? err.message : err,
                    };
                })()
            );
        } else {
            dispatch(
                (function () {
                    return {
                        type: ActionTypes.FORM_SUBMIT_SUCCEEDED,
                        formName,
                        submitName,
                    };
                })()
            );

            if (resetStatusOnSucces) {
                setTimeout(() => {
                    dispatch(
                        (function () {
                            return {
                                type: ActionTypes.FORM_RESET_STATUS,
                                formName,
                                submitName,
                            };
                        })()
                    );
                }, 1500);
            }
        }
    };
}
