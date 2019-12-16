import gql from 'graphql-tag';
import { ME } from '../../components/gql';

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
    },
    Mutation: {
        paymentConfirmed: (_root, variables, { cache, getCacheKey }) => {
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
        },
    },
};

export const typeDefs = gql`
    extend type Mutation {
        paymentConfirmed(gigId: ID, eventId: ID): Boolean
    }
    extend type User {
        isDj: Boolean
        isOwn: Boolean
        isOrganizer: Boolean
        displayName: String
    }
`;

export default resolvers;
