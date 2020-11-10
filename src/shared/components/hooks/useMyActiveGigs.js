import { useQuery } from '@apollo/client';
import { MY_ACTIVE_GIGS } from 'components/gql';
import { gigStates } from 'constants/constants';

export const useMyActiveGigs = () => {
    const { data } = useQuery(MY_ACTIVE_GIGS, {
        ssr: false,
    });

    const initialData = {
        [gigStates.ACCEPTED]: 0,
        [gigStates.REQUESTED]: 0,
        [gigStates.CONFIRMED]: 0,
        opportunities: data?.opportunities?.pageInfo.totalDocs || 0,
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
