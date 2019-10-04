import gql from 'graphql-tag';
import { ME } from 'components/gql';

export const defaultAppState = {
    __typename: 'State',
};

const getAppState = gql`
    query {
        state @client {
            appState {
                language
            }
        }
    }
`;

const updateAppState = (getState, writeState) => (_, appState) => {
    // get current / initial state from cache
    const state = getState(getAppState);

    const newState = {
        ...state,
        appState: { ...state.appState, ...appState },
    };

    writeState(newState);
    return newState;
};

const User = {
    isOwn: async (user, _, { client }) => {
        const { data: { me = null } = {} } = await client.query({ query: ME });
        if (me && me.id === user.id) {
            return true;
        }
        return false;
    },
    isDj: (user) => {
        if (user && user.appMetadata && user.appMetadata.roles) {
            return user.appMetadata.roles.includes('DJ');
        }
        return false;
    },
    isOrganizer: (user) => {
        if (user && user.appMetadata && user.appMetadata.roles) {
            return user.appMetadata.roles.includes('ORGANIZER');
        }
        return false;
    },
};

const paymentConfirmed = (_root, variables, { cache, getCacheKey }) => {
    const { gigId } = variables;
    const id = getCacheKey({ __typename: 'Event', id: variables.eventId });
    const fragment = gql`
        fragment confirmEvent on Event {
            status
            gigs {
                id
                status
            }
        }
    `;
    const event = cache.readFragment({ fragment, id });
    let { gigs } = event;
    gigs = gigs.map((g) =>
        g.id === gigId ? { ...g, status: 'CONFIRMED' } : { ...g, status: 'LOST' }
    );
    const data = { ...event, gigs, status: 'CONFIRMED' };
    cache.writeData({ id, data });
    return null;
};

export default (getState, writeState) => {
    return {
        User,
        Mutation: {
            updateAppState: updateAppState(getState, writeState),
            paymentConfirmed,
        },
    };
};
