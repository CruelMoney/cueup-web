module.exports = {
    path: 'payments_terms',
    onEnter: () => (document.title = 'Payments Terms of Service | Cueup'),

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/payments_terms').default);
        });
    },
};
