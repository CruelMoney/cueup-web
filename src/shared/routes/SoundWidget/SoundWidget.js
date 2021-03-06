import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import Sound from 'routes/User/routes/Sounds/Sound';
import { Style } from './styling';

const SOUND = gql`
    query Sound($id: ID!, $userId: ID) {
        sound(id: $id, userId: $userId) {
            id
            title
            url
            description
            date
            samples
            tags
            source
            duration {
                totalSeconds
            }
            file {
                id
                path
            }
            image {
                id
                path
            }
            user {
                id
                permalink
                artistName
                userMetadata {
                    firstName
                }
            }
        }
    }
`;

const SoundWidget = () => {
    const { id, userId } = useParams();

    const { data } = useQuery(SOUND, {
        variables: {
            id: id,
            userId,
        },
    });

    if (!data) {
        return <p>Sound not found</p>;
    }

    return (
        <>
            <Helmet>
                <title>Cueup Sound Widget</title>
            </Helmet>
            <Style />
            <Sound isWidget {...data.sound} />
        </>
    );
};

export default SoundWidget;
