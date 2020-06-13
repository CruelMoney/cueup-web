import { loadOlark } from './load';

export const showOlark = () => {
    loadOlark();
    window.olark('api.box.expand');
};
