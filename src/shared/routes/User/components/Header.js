import React, { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router';

import { useCookies } from 'react-cookie';
import Popup from 'components/common/Popup';

import { Media } from 'components/MediaContext';
import { LoadingIndicator, SecondaryButton } from '../../../components/Blocks';
import { Title, Body } from '../../../components/Text';

import { EDIT_STATUS } from '../../../constants/constants';
import { USER_EDITS } from '../gql';
import ProfileProgress from './ProfileProgress';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

const content = {
    [EDIT_STATUS.PENDING]: {
        title: {
            approved: 'We are reviewing your changes',
            unapproved: 'We are reviewing your application',
        },
        description: {
            approved:
                "Some of your recent changes need our approval, this usually doesn't take too long.",
            unapproved: 'In the meantime you can fill out the rest of your profile.',
        },
    },
    [EDIT_STATUS.REJECTED]: {
        title: {
            approved: 'Changes needed on your profile',
            unapproved: 'You need to make some changes to be approved',
        },
        description: {
            approved: 'Required changes:',
            unapproved: 'Required changes:',
        },
    },
};
const getRoutesFromUser = (user, pathname) => {
    const routes = [];

    if (user) {
        const roles = user.appMetadata.roles || [];
        const isDj = roles.includes('DJ');
        const isOrganizer = roles.includes('ORGANIZER');

        if (isDj) {
            routes.push({ route: 'overview', label: 'overview', active: true });
            routes.push({ route: 'photos', label: 'photos' });
            routes.push({ route: 'sounds', label: 'sounds' });

            if (user.reviews?.pageInfo.totalDocs > 0 || user.isOwn) {
                routes.push({ route: 'reviews', label: 'reviews' });
            }
        }
    }

    return routes.map((r) => ({ ...r, route: pathname + '/' + r.route }));
};

const Header = (props) => {
    const { user, pathname } = props;
    const { appMetadata } = user;
    const { profileStatus, approved } = appMetadata;

    const statusContent = content[profileStatus];
    const approvedKey = approved ? 'approved' : 'unapproved';

    const [cookies] = useCookies();

    const isTesting = cookies.testing;

    const [showing, setShowing] = useState(!isTesting && !approved && user.isOwn);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('dismissed-approval-modal');
        if (dismissed) {
            setShowing(false);
        }
    }, []);

    const dismissApprovalModal = () => {
        setShowing(false);
        sessionStorage.setItem('dismissed-approval-modal', true);
    };

    return (
        <>
            <Media greaterThanOrEqual="md">
                <HeaderDesktop
                    {...props}
                    routes={getRoutesFromUser(user, pathname)}
                    statusLabel={statusContent?.title[approvedKey]}
                />
            </Media>
            <Media at={'sm'}>
                <HeaderMobile
                    {...props}
                    routes={getRoutesFromUser(user, pathname)}
                    statusLabel={statusContent?.title[approvedKey]}
                />
            </Media>

            {user.isDj && (
                <Popup showing={showing} onClickOutside={dismissApprovalModal} width={'500px'}>
                    <EditPopup
                        profileStatus={profileStatus}
                        approvedKey={approvedKey}
                        close={dismissApprovalModal}
                        user={user}
                    />
                </Popup>
            )}
        </>
    );
};

const EditPopup = ({ profileStatus, approvedKey, close, user }) => {
    const { loading, data } = useQuery(USER_EDITS);
    const history = useHistory();
    const edits = data?.me?.edits || [];
    const statusContent = content[profileStatus];

    const goToSettings = () => {
        close();
        history.push('settings');
    };

    return (
        <div>
            <Title>{statusContent?.title[approvedKey]}</Title>
            <Body>{statusContent?.description[approvedKey]}</Body>
            {loading ? (
                <LoadingIndicator />
            ) : (
                <ol className="numbered-list">
                    {edits
                        ?.filter((e) => e.message)
                        .map((e) => (
                            <li key={e.id}>{e.message}</li>
                        ))}
                </ol>
            )}

            {profileStatus === EDIT_STATUS.REJECTED && (
                <SecondaryButton onClick={goToSettings}>Go to settings</SecondaryButton>
            )}

            {profileStatus === EDIT_STATUS.PENDING && (
                <ProfileProgress user={user} onClick={close} hideSharing />
            )}
        </div>
    );
};

export default Header;
