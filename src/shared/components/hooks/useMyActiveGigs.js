import { useQuery } from '@apollo/client';
import { MY_ACTIVE_GIGS } from 'components/gql';
import { gigStates } from 'constants/constants';

export const useMyActiveGigs = () => {
    const { data, refetch } = useQuery(MY_ACTIVE_GIGS, {
        variables: {
            afterDate: new Date(new Date().toDateString()),
        },
        ssr: false,
    });

    const initialData = {
        [gigStates.ACCEPTED]: 0,
        [gigStates.REQUESTED]: 0,
        [gigStates.CONFIRMED]: 0,
        opportunities: data?.opportunities?.pageInfo.totalDocs || 0,
        refetch,
        gigs: [],
    };

    if (!data?.myGigs) {
        return initialData;
    }

    return data.myGigs.edges.reduce(
        (totals, gig) => ({
            ...totals,
            [gig.status]: totals[gig.status] + 1,
            gigs: [...totals.gigs, gig],
        }),
        initialData
    );
};
