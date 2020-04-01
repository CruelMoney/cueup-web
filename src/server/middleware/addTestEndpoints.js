import { createProxyMiddleware } from 'http-proxy-middleware';

const API_URL = process.env.REACT_APP_CUEUP_GQL_DOMAIN;
const target = API_URL;
const apiProxy = createProxyMiddleware({ target, changeOrigin: true });

const addTestEndpoints = (app) => {
    app.use('/test', apiProxy);
};

export default addTestEndpoints;
