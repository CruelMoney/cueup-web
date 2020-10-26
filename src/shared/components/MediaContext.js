import { createMedia } from '@artsy/fresnel';

const ExampleAppMedia = createMedia({
    breakpoints: {
        sm: 0,
        md: 769, // ipad portrait mode included in sm
        lg: 1024,
        xl: 1192,
    },
});

// Generate CSS to be injected into the head
export const mediaStyle = ExampleAppMedia.createMediaStyle();
export const { Media, MediaContextProvider } = ExampleAppMedia;
