import c from '../constants/constants';

const ActionTypes = c.ActionTypes;

const initialState = {
    //define initial state - an empty form
    values: [],
};
const updateOffer = (values, newOffer, newStatus) => {
    return values.map((g) => {
        if (g.id !== newOffer.gigID) {
            return g;
        }
        return { ...g, status: newStatus, offer: newOffer };
    });
};

const gigs = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_GIGS_REQUESTED:
            return {
                ...state,
                isWaiting: true,
            };
        case ActionTypes.FETCH_GIGS_SUCCEEDED:
            return {
                ...state,
                isWaiting: false,
            };
        case ActionTypes.FETCH_GIGS_FAILED:
            return {
                ...state,
                err: action.err,
                isWaiting: false,
            };

        case ActionTypes.FETCH_GIG_REQUESTED:
            return {
                ...state,
                isWaiting: true,
            };
        case ActionTypes.FETCH_GIG_SUCCEEDED:
            return {
                ...state,
                values: [...state.values, action.gig],
                isWaiting: false,
            };
        case ActionTypes.FETCH_GIG_FAILED:
            return {
                ...state,
                err: action.err,
                isWaiting: false,
            };

        case ActionTypes.GIG_CANCELLED:
            return {
                ...state,
                values: state.values.map((g) =>
                    g.id === action.id ? { ...g, status: 'Cancelled' } : g
                ),
            };
        case ActionTypes.GIG_DECLINED:
            return {
                ...state,
                values: state.values.map((g) =>
                    g.id === action.id ? { ...g, status: 'Declined' } : g
                ),
            };
        case ActionTypes.GIG_OFFER_UPDATED:
            return {
                ...state,
                values: updateOffer(state.values, action.offer, 'Accepted'),
            };
        default:
            return state;
    }
};

export default gigs;
