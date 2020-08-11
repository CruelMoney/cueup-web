import moment from 'moment';
import { gigStates } from 'constants/constants';

export const getSystemMessage = ({ gig, showDecline, navigateToOffer }) => {
    if (!gig) {
        return null;
    }
    const { expires, status, directBooking } = gig;

    const within = moment(expires).fromNow(true);

    if (directBooking && status === gigStates.REQUESTED) {
        return {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The organizer is waiting on your offer. \nThis is a direct booking from your profile and the service fee is discarded.',
            actions: [
                {
                    label: 'Decline gig',
                    action: showDecline,
                },
                {
                    label: 'Make offer',
                    action: navigateToOffer,
                },
            ],
        };
    }

    const messages = {
        [gigStates.REQUESTED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: `The organizer is waiting on your offer. \nMake an offer ${
                expires ? 'within ' + within : 'quickly'
            } or the gig will automatically be declined. You can always update the offer later until the organizer has confirmed.`,
            actions: [
                {
                    label: 'Decline gig',
                    action: showDecline,
                },
                {
                    label: 'Make offer',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.ACCEPTED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Waiting on confirmation from the organizer. \nYou can still update the offer if necessary.',
            actions: [
                {
                    label: 'Update offer',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.CONFIRMED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Whoop! The gig has been confirmed. \nMake sure that everything is agreed upon with the organizer, and get ready to play.',
            actions: [
                {
                    label: 'See details',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.EVENT_CANCELLED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'The event has been cancelled.',
        },
        [gigStates.FINISHED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The gig is finished, we hope you had a good time. \nAsk the organizer to leave a review.',
        },
        [gigStates.LOST]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Another DJ will play this gig. \nTo increase your chances of getting gigs, make sure that your profile is complete with pictures, a good bio, mixtapes etc.',
        },
        [gigStates.DECLINED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'You have declined this gig',
        },
        [gigStates.CANCELLED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'You have cancelled this gig',
        },
        [gigStates.ORGANIZER_DECLINED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Another DJ will play this gig. \nTo increase your chances of getting gigs, make sure that your profile is complete with pictures, a good bio, mixtapes etc.',
        },
    };

    return messages[status];
};
