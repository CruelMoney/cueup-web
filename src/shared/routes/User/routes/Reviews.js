import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';

import { Route, useHistory } from 'react-router';
import { Query } from '@apollo/client/react/components';
import { Helmet } from 'react-helmet-async';
import { Title, Body, BodySmall, BodyBold } from '../../../components/Text';
import {
    Col,
    Row,
    TeritaryButton,
    PrimaryButton,
    RowMobileCol,
    AddButton,
} from '../../../components/Blocks';

import { REVIEWS, WRITE_TESTIMONIAL, REMOVE_TESTIMONIAL, USER } from '../gql';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';

import EmptyPage from '../../../components/common/EmptyPage';
import { Input } from '../../../components/FormComponents';
import Popup from '../../../components/common/Popup';

import SavingIndicator from '../../../components/SavingIndicator';
import Review from '../components/Review';

const ReviewsCol = styled(Col)`
    flex: 1;
    width: 100%;
    border-right: 1px solid #e9ecf0;
    @media only screen and (max-width: 425px) {
        border-right: none;
    }
`;

const VenuesCol = styled(Col)`
    width: 190px;
    margin-left: 24px;
    @media only screen and (max-width: 425px) {
        width: auto;
        margin-left: 0;
    }
`;

const Reviews = ({ user, loading: loadingUser, updateUser }) => {
    if (loadingUser) {
        return <LoadingPlaceholder2 />;
    }

    const metaTitle = `${user.title} · Reviews · Cueup`;
    const metaDescription = `Read reviews and testimonials of ${user.title}.`;

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />

                <meta name="description" content={metaDescription} />
                <meta name="twitter:description" content={metaDescription} />
                <meta property="og:description" content={metaDescription} />
            </Helmet>
            <Query query={REVIEWS} variables={{ id: user.id }}>
                {({ loading, data }) => {
                    if (loading) {
                        return <LoadingPlaceholder2 />;
                    }

                    const {
                        user: {
                            isOwn,
                            playedVenues,
                            reviews: { edges },
                        },
                    } = data;
                    return (
                        <Content
                            userId={user.id}
                            playedVenues={playedVenues}
                            reviews={edges}
                            isOwn={isOwn}
                            permalink={user.permalink}
                            updateUser={updateUser}
                        />
                    );
                }}
            </Query>
        </>
    );
};

const RemoveButton = styled(TeritaryButton)`
    display: none;
    position: absolute;
    min-width: 0;
    height: 18px;
    top: 4px;
    right: -50px;
`;

const VenueLabel = styled(BodyBold)`
    font-size: 18px;
    color: #4d6480;
    text-align: left;
    text-transform: capitalize;
    margin-bottom: 0;
`;

const VenueListItem = styled.li`
    margin-bottom: 15px;
    position: relative;
    :hover ${RemoveButton} {
        display: inline-block;
    }
`;

const Cta = ({ onClick }) => (
    <>
        <Body style={{ maxWidth: 300, marginBottom: '15px' }}>
            Add a testimonial to display something for the organizers
        </Body>
        <PrimaryButton onClick={onClick}>Add testimonial</PrimaryButton>
    </>
);

const Content = ({ playedVenues, reviews, isOwn, permalink, userId, updateUser }) => {
    const [isAddingVenue, setIsAddingVenue] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({});
    const history = useHistory();

    const saveVenue = (venue) => {
        venue = venue.trim();
        if (venue) {
            updateUser({
                variables: {
                    id: userId,
                    playedVenues: [...playedVenues, venue],
                },
            });
        }
        setIsAddingVenue(false);
    };

    const deleteVenue = (venue) => {
        updateUser({
            variables: {
                id: userId,
                playedVenues: playedVenues.filter((v) => v !== venue),
            },
        });
    };

    const [writeTestimonial, { loading, error }] = useMutation(WRITE_TESTIMONIAL, {
        variables: newTestimonial,
        refetchQueries: [
            { query: REVIEWS, variables: { id: userId } },
            { query: USER, variables: { permalink } },
        ],
        awaitRefetchQueries: true,
    });

    const [removeTestimonial, { loading: loadingRemove }] = useMutation(REMOVE_TESTIMONIAL, {
        refetchQueries: [
            { query: REVIEWS, variables: { id: userId } },
            { query: USER, variables: { permalink } },
        ],
        awaitRefetchQueries: true,
    });

    return (
        <>
            <SavingIndicator error={error} loading={loading || loadingRemove} />
            <RowMobileCol>
                <ReviewsCol>
                    {reviews.length === 0 ? (
                        <EmptyPage
                            title="No reviews yet"
                            message={
                                isOwn ? <Cta onClick={() => history.push('reviews/add-new')} /> : ''
                            }
                        />
                    ) : null}

                    {reviews.map((r) => (
                        <Review
                            key={r.id}
                            {...r}
                            isOwn={isOwn}
                            removeTestimonial={removeTestimonial}
                        />
                    ))}
                    {isOwn && reviews.length > 0 && (
                        <Row>
                            <AddButton onClick={() => history.push('reviews/add-new')}>
                                + Add testimonial
                            </AddButton>

                            <BodySmall style={{ maxWidth: '300px' }}>
                                Highlight a review or testimonial by selecting the text with the
                                mouse.
                            </BodySmall>
                        </Row>
                    )}
                </ReviewsCol>
                {(playedVenues.length > 0 || isOwn) && (
                    <VenuesCol>
                        <Title style={{ marginBottom: '36px' }}>Past venues</Title>
                        <ul>
                            {playedVenues.map((v, idx) => (
                                <VenueListItem key={idx}>
                                    <VenueLabel>{v}</VenueLabel>
                                    {isOwn && (
                                        <RemoveButton onClick={() => deleteVenue(v)}>
                                            remove
                                        </RemoveButton>
                                    )}
                                </VenueListItem>
                            ))}
                        </ul>
                        {isAddingVenue && (
                            <Input autoFocus type="text" placeholder="venue" onSave={saveVenue} />
                        )}

                        {isOwn && (
                            <AddButton onClick={() => setIsAddingVenue(true)}>
                                + Add venue
                            </AddButton>
                        )}
                    </VenuesCol>
                )}
            </RowMobileCol>

            <Route path={'*/reviews/add-new'}>
                <EditPopup
                    setNewTestimonial={setNewTestimonial}
                    loading={loading}
                    writeTestimonial={writeTestimonial}
                />
            </Route>
        </>
    );
};

const EditPopup = ({ setNewTestimonial, loading, writeTestimonial }) => {
    const history = useHistory();

    return (
        <Popup lazy={false} width={450} showing onClickOutside={history.goBack}>
            <Input
                type="text"
                placeholder="Wedding"
                label="Title"
                onChange={(title) => setNewTestimonial((t) => ({ ...t, title }))}
            />
            <Input
                type="text"
                placeholder="Barack Obama"
                label="Testifier"
                onChange={(testifier) => setNewTestimonial((t) => ({ ...t, testifier }))}
            />
            <Input
                style={{
                    height: '250px',
                }}
                type="text-area"
                placeholder="Testimonial"
                onChange={(content) => setNewTestimonial((t) => ({ ...t, content }))}
            />
            <Row style={{ marginTop: '15px' }} right>
                <TeritaryButton type="button" onClick={history.goBack}>
                    Cancel
                </TeritaryButton>
                <PrimaryButton
                    type="button"
                    loading={loading}
                    onClick={() => {
                        writeTestimonial();
                        history.goBack();
                    }}
                >
                    Save
                </PrimaryButton>
            </Row>
        </Popup>
    );
};

export default Reviews;
