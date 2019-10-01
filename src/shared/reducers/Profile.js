import cloneDeep from 'lodash/cloneDeep';
import c from '../constants/constants';

const ActionTypes = c.ActionTypes;

const initialState = {
    //define initial state - an empty form
};

const profile = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_SUCCEEDED:
            return cloneDeep(action.profile);

        case ActionTypes.UPDATEPROFILE_SUCCEEDED:
            return cloneDeep(action.profile);

        case ActionTypes.LOGOUT_SUCCEEDED:
            return initialState;

        case ActionTypes.RESET_PROFILE:
            return cloneDeep(action.profile);

        default:
            return state;
    }
};

export default profile;
