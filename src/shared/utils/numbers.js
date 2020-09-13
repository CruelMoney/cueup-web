export const numbers = {
    clamp: function (n, t, r) {
        return Math.max(Math.min(n, r), t);
    },
    lerp: function (n, t, r) {
        return n * (1 - r) + t * r;
    },
};
