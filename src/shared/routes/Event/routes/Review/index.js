import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { EVENT_REVIEW, WRITE_REVIEW } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { Col, Hr, SmartButton } from '../../../../components/Blocks';
import { Title, Body, PageTitle } from '../../../../components/Text';
import { TextArea } from '../../../../components/FormComponents';
import Rating from '../../../../components/common/RatingNew';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';

const Content = ({ match }) => {
    const {
        params: { id, hash },
    } = match;

    const { data, loading: loadingReview } = useQuery(EVENT_REVIEW, {
        skip: !id || !hash,
        variables: { id, hash },
    });

    const [save, { loading: saving, error }] = useMutation(WRITE_REVIEW);
    const [state, setState] = useState({});

    const { event } = data || {};
    const { review, chosenGig, status } = event || {};
    const { dj } = chosenGig || {};

    useEffect(() => {
        setState(review || {});
    }, [review]);

    if (loadingReview || !data) {
        return <LoadingPlaceholder2 style={{ marginTop: '30px' }} />;
    }

    if (status !== 'FINISHED') {
        return <Body>Come back and leave a review when the event is finished.</Body>;
    }

    if (!dj) {
        return <Body>No DJ was found for this event.</Body>;
    }

    const saveReview = async () => {
        if (!state.rating) {
            window.alert('Please enter rating');
            return;
        }

        await save({
            variables: {
                ...state,
                gigId: chosenGig ? chosenGig.id : null,
            },
        });
    };

    const djName = dj ? dj.artistName || dj.userMetadata.firstName : 'the dj';

    return (
        <ReviewCol key={review ? review.id : 'review'}>
            <Body>Write a review of {djName}.</Body>
            <Rating
                style={{ marginTop: '30px', marginBottom: '15px' }}
                size="large"
                rating={review ? review.rating : 0}
                onChange={(rating) => setState((s) => ({ ...s, rating }))}
            />
            <TextArea
                style={{ marginBottom: '30px', height: '200px' }}
                defaultValue={review ? review.content : null}
                onChange={({ target: { value: content } }) => setState((s) => ({ ...s, content }))}
            />
            <SmartButton level="primary" loading={saving} onClick={() => saveReview()}>
                {review && review.id ? 'Update' : 'Save'}
            </SmartButton>
            <ErrorMessageApollo error={error} />
        </ReviewCol>
    );
};

const ReviewCol = styled(Col)`
    max-width: 500px;
    align-items: flex-start;
`;

const Review = (props) => (
    <Col>
        <PageTitle hideMobile>Review</PageTitle>
        <Hr style={{ marginBottom: 30 }} />
        <Content {...props} />
    </Col>
);

export default Review;
