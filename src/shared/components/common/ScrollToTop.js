import { useEffect } from 'react';
import { withRouter } from 'react-router';

const ScrollToTop = ({ location: { pathname }, top = 0, animate, alwaysScroll = false }) => {
    useEffect(() => {
        const elId = window.location.hash;
        let newTop = top;
        if (elId) {
            try {
                const el = document.querySelector(elId);
                if (el) {
                    newTop = el.getBoundingClientRect().top + window.scrollY;
                }
            } catch (error) {}
        }
        if (alwaysScroll || window.scrollY > newTop) {
            window.scroll({
                top: newTop,
                left: 0,
                behavior: animate ? 'smooth' : 'auto',
            });
        }
    }, [alwaysScroll, animate, pathname, top]);

    return null;
};

export default withRouter(ScrollToTop);
