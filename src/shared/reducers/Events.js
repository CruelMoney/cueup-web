import c from '../constants/constants';

const ActionTypes = c.ActionTypes;

const initialState = {
    //define initial state - an empty form
    values: [],
    isWaiting: false,
};

const events = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_EVENTS_REQUESTED:
            return {
                ...state,
                isWaiting: true,
            };
        case ActionTypes.FETCH_EVENTS_SUCCEEDED:
            return {
                ...state,
                values: action.events,
                isWaiting: false,
            };
        case ActionTypes.FETCH_EVENTS_FAILED:
            return {
                ...state,
                err: action.err,
                isWaiting: false,
            };
        case ActionTypes.EVENT_CONFIRMED:
            // eslint-disable-next-line no-case-declarations
            const event = { ...state.values[0], status: 'Confirmed' };
            return {
                ...state,
                values: [event],
            };
        default:
            return state;
    }
};

export default events;
