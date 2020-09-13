export const easings = {
    easeInOutCubic: function (t, n, e, u) {
        return (t /= u / 2) < 1 ? (e / 2) * t * t * t + n : (e / 2) * ((t -= 2) * t * t + 2) + n;
    },
    easeInQuart: function (t, n, e, u) {
        const a = t / u;
        return e * a * a ** 3 + n;
    },
    easeOutQuart: function (t, n, e, u) {
        const a = t / u - 1;
        return -e * (a * a ** 3 - 1) + n;
    },
    easeInOutQuart: function (t, n, e, u) {
        let a = t / (u / 2);
        return a < 1 ? (e / 2) * a ** 4 + n : ((a -= 2), (-e / 2) * (a * a ** 3 - 2) + n);
    },
    easeInOutBack: function (t, n, e, u, a) {
        // eslint-disable-next-line no-eq-null
        let r = a == null ? 1.70158 : a;
        let s = t / (u / 2);
        return (
            (r = 1.525 * r + 1),
            s < 1
                ? (e / 2) * (s * s * (r * s - r) + n)
                : ((s -= 2), (e / 2) * (s * s * (r * s + r) + 2) + n)
        );
    },
    easeOutElastic: function (t, n, e, u, a = 700) {
        if (!t || !e) {
            return n;
        }
        const r = t / u;
        if (r === 1) {
            return n + e;
        }
        const s = e;
        const c = u * (1 - Math.min(a, 999) / 1e3);
        const i = s < Math.abs(e) ? c / 4 : (c / (2 * Math.PI)) * Math.asin(e / s);
        return s * 2 ** (-10 * r) * Math.sin(((r * u - i) * (2 * Math.PI)) / c) + e + n;
    },
};
