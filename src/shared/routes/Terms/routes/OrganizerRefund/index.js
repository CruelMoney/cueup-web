module.exports = {
    path: 'organizer_refund_policy',
    onEnter: () => (document.title = 'Organizer Refund Policy Terms | Cueup'),

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/organizer_refund_policy').default);
        });
    },
};
