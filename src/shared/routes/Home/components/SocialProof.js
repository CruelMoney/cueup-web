import React from 'react';

import JoinThousands from 'routes/BecomeDj/components/JoinThousands';

const SocialProof = () => {
    return (
        <JoinThousands
            title={'Find your DJ on Cueup like 1.000s of other event organizers'}
            to={'/book-dj'}
            label="Find a DJ"
        />
    );
};

export default SocialProof;
