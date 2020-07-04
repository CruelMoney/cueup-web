import gql from 'graphql-tag';
import { EDIT_STATUS } from 'constants/constants';
import { ME } from '../../components/gql';

const getEditsMap = (user) => {
    if (!user) {
        return {};
    }
    const { edits = [] } = user || {};

    return edits.reduce(
        (acc, edit) => ({
            ...acc,
            [edit.fieldName]: {
                ...edit,
                hasError: edit.status === EDIT_STATUS.REJECTED,
                attention: edit.status === EDIT_STATUS.PENDING,
            },
        }),
        {}
    );
};

const resolvers = {
    User: {
        isOwn: async (user, variables, { client }) => {
            const { data: { me } = {} } = await client.query({ query: ME });
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
        displayName: (user) => {
            const { userMetadata, artistName } = user ?? {};
            const { firstName } = userMetadata ?? {};
            return artistName ?? firstName;
        },
        editsMap: getEditsMap,
    },
    Gig: {
        tempPaidIndicator: () => false,
    },
    Mutation: {
        paymentConfirmed: (_root, variables, { cache, getCacheKey, client }) => {
            const { gigId, amountLeft, amountPaid } = variables;
            const id = getCacheKey({ __typename: 'Event', id: variables.eventId });
            const fragment = gql`
                fragment confirmEvent on Event {
                    status
                    chosenGig {
                        id
                    }
                    gigs {
                        id
                        status
                        tempPaidIndicator @client
                    }
                }
            `;
            const event = cache.readFragment({ fragment, id });
            let { gigs } = event;
            let chosenGig = null;
            gigs = gigs.map((g) => {
                const isChosen = g.id === gigId;
                if (!isChosen) {
                    return { ...g, status: 'LOST' };
                }

                chosenGig = {
                    ...g,
                    status: 'CONFIRMED',
                    tempPaidIndicator: true,
                };
                return chosenGig;
            });
            const data = { ...event, chosenGig, gigs, status: 'CONFIRMED' };
            cache.writeData({ id, data });

            return null;
        },
    },
};

export const typeDefs = gql`
    extend type Mutation {
        paymentConfirmed(gigId: ID, eventId: ID, amountLeft: JSON, amountPaid: JSON): Boolean
    }
    extend type User {
        isDj: Boolean
        isOwn: Boolean
        isOrganizer: Boolean
        displayName: String
    }
    extend type Gig {
        tempPaidIndicator: Boolean
    }
`;

export default resolvers;
