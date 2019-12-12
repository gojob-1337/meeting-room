import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../frontend/src', true, /\.stories\.js$/), module);
