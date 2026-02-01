import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Scrolls the window to the top when the route changes
 * This fixes the issue where scroll position persists between pages
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
