import moment from 'moment-timezone';
import profilePic from '../assets/default-profile-pic.png';
import Formatter from './Formatter';

const filterEmailSettings = (settings, isDj, isCustomer) => {
    if (!settings) {
        return {};
    }
    if (!isDj) {
        delete settings['Event cancelation'];
        delete settings['Event update'];
        delete settings['Event opened for offer'];
        delete settings['New request'];
        delete settings['Offer accepted'];
        delete settings['New review'];
    }
    if (!isCustomer) {
        delete settings['DJ cancelation'];
        delete settings['Event Can Be Payed Now'];
        delete settings['New DJ offer'];
        delete settings['Payment Recipe'];
    }

    // adding new settings
    if (!('New message' in settings)) {
        settings['New message'] = true;
    }
    return settings;
};

// const removeTimezone = (date) =>{
//   const newDate = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
//   return newDate;
// }

const location = {
    fromDTO(DTO) {
        return {
            lat: DTO.lat,
            lng: DTO.lng,
            name: DTO.name,
        };
    },
    toDTO(location) {
        return {
            lat: location.lat,
            lng: location.lng,
            name: location.name,
        };
    },
};

const settings = {
    fromDTO: function(DTO, isDj, isCustomer) {
        return {
            ...DTO,
            emailSettings: filterEmailSettings(DTO.emailSettings, isDj, isCustomer),
        };
    },
    toDTO: function(settings) {
        return settings;
    },
};

const user = {
    fromDTO: function(DTO) {
        return {
            ...DTO,
            user_metadata: {
                ...DTO.user_metadata,
                permaLink: DTO.user_metadata.permaLink
                    ? DTO.user_metadata.permaLink.toLowerCase()
                    : null,
            },
            bio: DTO.bio,
            email: DTO.email,
            experienceCount: DTO.experienceCount,
            picture:
                !DTO.picture || DTO.picture.includes('default-profile-pic')
                    ? profilePic
                    : DTO.picture,
            playingLocation: DTO.playingLocation,
            playingRadius: DTO.playingRadius,
            user_id: DTO.user_id,
            genres: DTO.genres,
            createdAt: DTO.createdAt,
            //  reviews : DTO.reviews ? DTO.reviews.map(r => review.fromDTO(r)) : [],
            settings: DTO.settings
                ? settings.fromDTO(DTO.settings, DTO.app_metadata.isDJ, DTO.app_metadata.isCustomer)
                : null,

            // user_metadata stuff here
            address: DTO.user_metadata.address,
            name: DTO.user_metadata.firstName + ' ' + DTO.user_metadata.lastName,
            firstName: DTO.user_metadata.firstName,
            lastName: DTO.user_metadata.lastName,
            censoredName:
                DTO.user_metadata.firstName + ' ' + DTO.user_metadata.lastName.slice(0, 1) + '.',
            birthDay: DTO.user_metadata.birthDay,
            city: DTO.user_metadata.city,
            phone: DTO.user_metadata.phone,
            currency: DTO.user_metadata.currency || 'DKK',
            last4: DTO.user_metadata.last4,
            geoCity: DTO.user_metadata.geoCity,
            geoCountry: DTO.user_metadata.geoCountry,

            //App metadata stuff here
            auth0Id: DTO.app_metadata.auth0Id,
            avgRating: DTO.app_metadata.avgRating,
            earned: '0',
            email_verified: DTO.app_metadata.email_verified,
            gigsCount: DTO.app_metadata.gigsCount,
            upcomingEvents: DTO.app_metadata.upcomingEvents,
            finishedEvents: DTO.app_metadata.finishedEvents,
            isCustomer: DTO.app_metadata.isCustomer,
            isDJ: DTO.app_metadata.isDJ,
            stripeID: DTO.app_metadata.stripeID,
            tosAcceptanceIP: DTO.app_metadata.tosAcceptanceIP,
            tosAcceptanceDate: DTO.app_metadata.tosAcceptanceDate,
            discountPoints: DTO.app_metadata.discountPoints,

            //self calculated extra info here
            provider: DTO.app_metadata.auth0Id ? DTO.app_metadata.auth0Id.split('|')[0] : '',
        };
    },

    toDTO: function(profile) {
        return {
            ...profile,
            bio: profile.bio,
            email: profile.email,
            experienceCount: profile.experienceCount,
            // picture: profile.picture,
            playingLocation: profile.playingLocation,
            playingRadius: profile.playingRadius,
            user_id: profile.user_id,
            genres: profile.genres,
            settings: settings.toDTO(profile.settings),

            user_metadata: {
                ...profile.user_metadata,
                address: profile.address,
                firstName: Formatter.name.GetFirstAndLast(profile.name).firstName,
                lastName: Formatter.name.GetFirstAndLast(profile.name).lastName,
                birthDay:
                    typeof profile.birthday === 'string'
                        ? Formatter.date.FromEUStringToUSDate(profile.birthday)
                        : profile.birthday,
                city: profile.city,
                phone: profile.phone,
                geoCity: profile.geoCity,
                geoCountry: profile.geoCountry,
            },
            //nothing is set here because it cant be updated in the client
            app_metadata: {},
        };
    },
};

const review = {
    fromDTO: function(DTO) {
        return {
            eventLocation: location.fromDTO(DTO.eventLocation),
            eventDate: new Date(DTO.eventDate),
            eventName: DTO.eventName,
            author: DTO.reviewer ? user.fromDTO(DTO.reviewer).censoredName : 'Deleted user',
            authorPicture: DTO.reviewer ? user.fromDTO(DTO.reviewer).picture : profilePic,
            description: DTO.description,
            date: new Date(DTO.date),
            rating: DTO.rating,
            DJId: DTO.djId,
        };
    },
    //The API will automatically assign the rest of the review properties
    toDTO(review) {
        return {
            description: review.description,
            rating: review.rating,
        };
    },
};

const cueupEvent = {
    fromDTO: function(DTO) {
        return {
            ...DTO,
            id: DTO.id,
            genres: DTO.genres,
            customerId: DTO.customerId,
            description: DTO.description,
            name: DTO.name,
            chosenOfferId: DTO.chosenOfferId,
            location: location.fromDTO(DTO.location),
            status: DTO.status,
            startTime: moment.tz(DTO.startTime, DTO.timeZone).format(),
            endTime: moment.tz(DTO.endTime, DTO.timeZone).format(),
            guestsCount: DTO.guestsCount,
            currency: DTO.currency,
            minPrice: DTO.minPrice,
            maxPrice: DTO.maxPrice,
            rider: DTO.rider,
            date: Formatter.date.ToEU(DTO.startTime),
            review: DTO.review ? review.fromDTO(DTO.review) : null,
        };
    },
    toDTO: function(event) {
        return {
            ...event,
            offers: [],
            Genres: event.genres,
            Description: event.description,
            Name: event.name,
            ChosenOfferId: event.chosenOfferId,
            Location: location.toDTO(event.location),
            StartTime: event.startTime,
            EndTime: event.endTime,
            GuestsCount: event.guestsCount,
            Currency: event.currency,
            MinPrice: event.minPrice,
            MaxPrice: event.maxPrice,
            Rider: event.rider,
        };
    },
};

export default {
    user,
    settings,
    location,
    cueupEvent,
    review,
};
