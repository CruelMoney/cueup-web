import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { useMutation } from '@apollo/client';
import { InlineIcon } from '@iconify/react';
import infoIcon from '@iconify/icons-ion/information-circle';
import RadioSelect from 'components/RadioSelect';
import useTranslate from 'components/hooks/useTranslate';
import Tooltip from 'components/Tooltip';
import GreyBox from 'components/GreyBox';
import { MY_ACTIVE_GIGS } from 'components/gql';
import { UNDO_DECLINE } from 'routes/Gigs/gql';
import { GET_OFFER, MAKE_OFFER, GIG } from '../../gql';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';
import { gigStates, PAYOUT_TYPES } from '../../../../constants/constants';
import {
    SmartButton,
    PrimaryButton,
    RowWrap,
    Row,
    Hr,
    TeritaryButton,
    RowMobileCol,
} from '../../../../components/Blocks';
import { Input, InputRow, ProFeature } from '../../../../components/FormComponents';
import CurrencySelector from '../../../../components/CurrencySelector';
import { Body, BodyBold, TitleClean } from '../../../../components/Text';

const DeclinedInformation = ({
    gig,
    loading,
    translate,
    serviceFee,
    djFee,
    totalPayout,
    isPro,
    discount,
}) => {
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
