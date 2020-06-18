function getCookie(name) {
    if (typeof window !== 'object') {
        return null;
    }
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

export default getCookie;
