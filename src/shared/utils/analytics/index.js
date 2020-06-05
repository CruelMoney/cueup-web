import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import facebookPixelPlugin from './facebookPixelPlugin';

const isDevelopment = process.env.NODE_ENV === 'development';

const mockAnalytics = {
    page: () => {},
    track: () => {},
    identify: () => {},
};

const analytics = isDevelopment
    ? mockAnalytics
    : Analytics({
          app: 'cueup-web',
          plugins: [
              googleAnalytics({
                  trackingId: 'UA-59876038-4',
                  debug: true,
              }),
              facebookPixelPlugin({
                  pixelId: '1461498583979582',
              }),
          ],
      });

export const trackPageView = (url) => {
    analytics.page({
        url,
        path: url,
    });
};

export const trackCheckAvailability = () => {
    analytics.track('Search', {
        category: 'Events',
    });
};

export const trackSignup = () => {
    analytics.track('CompleteRegistration', {
        category: 'Users',
    });
};

export const trackEventPosted = () => {
    analytics.track('Created', {
        category: 'Events',
    });
};
export const trackEventPaid = (value) => {
    analytics.track('Purchase', {
        category: 'Events',
        value,
    });
};

export const trackCheckout = () => {
    analytics.track('InitiateCheckout', {
        category: 'Events',
    });
};

export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(window.location.href);
    }, [location.pathname]);
};
