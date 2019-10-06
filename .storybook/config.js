import { configure, addDecorator } from '@storybook/react';
import centered from '@storybook/addon-centered/react';

addDecorator(centered);
// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);
