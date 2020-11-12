import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import GreyBox from 'components/GreyBox';
import { MY_ACTIVE_GIGS } from 'components/gql';
import { UNDO_DECLINE } from 'routes/Gigs/gql';
import { GIG } from '../../gql';

import { SmartButton, RowMobileCol } from '../../../../components/Blocks';
import { TitleClean } from '../../../../components/Text';

const DeclinedInformation = ({ gig }) => {
    const [undoDecline, { loading: undoingDecline, data: undoData }] = useMutation(UNDO_DECLINE, {
        variables: {
            id: gig?.id,
        },
        awaitRefetchQueries: true,
        refetchQueries: [
            {
                query: GIG,
                variables: {
                    id: gig.id,
                },
            },
            { query: MY_ACTIVE_GIGS },
        ],
    });

    return (
        <GreyBox>
            <TitleClean style={{ marginBottom: '0.5em' }}>You've declined this gig</TitleClean>
            <RowMobileCol>
                <SmartButton level="secondary" onClick={undoDecline} loading={undoingDecline}>
                    Undo decline
                </SmartButton>
            </RowMobileCol>
        </GreyBox>
    );
};

export default DeclinedInformation;
