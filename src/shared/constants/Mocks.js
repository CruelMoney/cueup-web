module.exports = {
    MockOffer: {
        gigID: 0,
        amount: 5000,
        fee: 80,
        currency: 'DKK',
        gigStatus: 'Finished',
    },
    REVIEWS: [
        {
            picture:
                'http://images.medicaldaily.com/sites/medicaldaily.com/files/2014/06/06/old-lady.jpg',
            author: 'Mageroth B.',
            date: 'Sunday, 31th July',
            rating: 1,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            event: {
                name: 'B-day bash',
                location: 'Copenhagen',
                date: 'Saturday, 30th July',
            },
        },
        {
            picture: 'http://altdaily.com/wp-content/uploads/2016/09/potter_1.jpg',
            author: 'Harry P.',
            date: 'Sunday, 31th July',
            rating: 4.5,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            event: {
                name: 'B-day bash',
                location: 'Copenhagen',
                date: 'Saturday, 30th July',
            },
        },
    ],

    GIGS: [
        {
            name: 'Awesome birtday',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '21:00',
            endTime: '03:00',
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 100,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            genres: ['Hip Hop', 'R&B', 'House'],
            speakers: 'Yes',
            status: 'REQUESTED',
        },

        {
            name: 'Crazy housewarming',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '21:00',
            endTime: '03:00',
            price: 1000,
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 100,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis.',
            genres: ['Hip Hop', 'R&B'],
            speakers: 'No',
            status: 'ACCEPTED',
        },

        {
            name: "50'års",
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '21:00',
            endTime: '03:00',
            price: 3000,
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 100,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis.',
            genres: ['Hip Hop', 'R&B'],
            speakers: 'No',
            status: 'LOST',
        },

        {
            name: 'Epic outdoor clubbing event',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '00:00',
            endTime: '08:00',
            price: 10000,
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 1000,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            genres: ['Techno', 'House'],
            speakers: 'Yes',
            status: 'CONFIRMED',
        },

        {
            name: 'Boring outdoor clubbing event',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '00:00',
            endTime: '08:00',
            price: 100,
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 1000,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            genres: ['Techno', 'House'],
            speakers: 'Yes',
            status: 'PLAYED',
        },
    ],

    EVENTS: [
        {
            id: 1,
            name: 'Awesome birtday',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '21:00',
            endTime: '03:00',
            offers: [
                {
                    name: 'Christopher Dengsø',
                    price: 2000,
                    avgRating: 5,
                    queupGigs: 3,
                    otherGigs: 12,
                    phone: '24658061',
                    email: 'cd@yees.dk',
                },
                {
                    name: 'DJ jazzy jeff',
                    price: 4000,
                    avgRating: 1,
                    queupGigs: 3,
                    otherGigs: 12,
                    phone: '24658061',
                    email: 'jazzy@jeff.com',
                },
                {
                    name: 'DJ snowden',
                    price: 0,
                    avgRating: 3,
                    queupGigs: 3,
                    otherGigs: 12,
                    phone: '24658061',
                    email: 'edward@snowden.io',
                },
            ],
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 100,
            address: '',
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            genres: ['Hip Hop', 'R&B', 'House'],
            speakers: 'SPEAKERS_YES',
            status: 'ACCEPTED',
        },

        {
            id: 2,
            name: 'Crazy housewarming',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '21:00',
            endTime: '03:00',
            offers: [],
            address: '',
            dj: {
                name: 'Christopher Dengsø',
                price: 2000,
                avgRating: 5,
                queupGigs: 3,
                otherGigs: 12,
                phone: '24658061',
                email: 'cd@yees.dk',
            },
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 100,
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis.',
            genres: ['Hip Hop', 'R&B'],
            speakers: 'SPEAKERS_NO',
            status: 'CONFIRMED',
        },

        {
            id: 3,
            name: 'Epic outdoor clubbing event',
            location: 'Copenhagen',
            date: 'Saturday, 30th July',
            startTime: '00:00',
            endTime: '08:00',
            offers: [],
            dj: {
                name: 'Christopher Dengsø',
                price: 10000,
                avgRating: 5,
                queupGigs: 3,
                otherGigs: 12,
                phone: '24658061',
                email: 'cd@yees.dk',
            },
            contact: {
                name: 'Christopher',
                phone: '24658061',
                email: 'test@email.com',
            },
            guests: 1000,
            address: '',
            description:
                'Etiam facilisis libero sapien, in elementum velit vestibulum a. In id vestibulum turpis. Pellentesque convallis est enim, quis bibendum dui maximus quis. Nulla vel augue velit. Proin id arcu turpis. Curabitur elementum sagittis nulla, efficitur tincidunt eros finibus at. Maecenas fermentum rutrum massa eget vehicula. Vestibulum tempus neque quis dolor convallis, vel consequat diam sollicitudin. Sed ut tincidunt urna, vel laoreet ipsum.',
            genres: ['Techno', 'House'],
            speakers: 'SPEAKERS_UNCERTAIN',
            status: 'FINISHED',
        },
    ],
};
