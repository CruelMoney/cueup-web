import { useQuery } from '@apollo/client';
import { MY_ACTIVE_GIGS } from 'components/gql';
import { gigStates } from 'constants/constants';

export const useMyActiveGigs = (options) => {
    const { skip } = options || {};
    const { data } = useQuery(MY_ACTIVE_GIGS, {
        ssr: false,
        skip,
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
            [gig.status]:
                totals[gig.status] +
                (gig.opportunity && gig.status === gigStates.REQUESTED ? 0 : 1),
            gigs: [...totals.gigs, gig],
        }),
        initialData
    );
};
